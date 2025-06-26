-- Analytics table schema for Supabase
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  messaging_variant CHAR(1),
  customer_segments TEXT[],
  
  -- Event-specific data
  element VARCHAR(255),
  message TEXT,
  benefit_type VARCHAR(100),
  action VARCHAR(50),
  field_name VARCHAR(100),
  field_value TEXT,
  field_category VARCHAR(50),
  
  -- Conversion data
  form_data JSONB,
  conversion_path JSONB,
  path_duration INTEGER,
  
  -- Behavioral data
  referrer TEXT,
  landing_page VARCHAR(255),
  last_interaction JSONB,
  time_on_site INTEGER,
  
  -- Performance
  duration INTEGER,
  step VARCHAR(100),
  
  -- Indexing for performance
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_analytics_session ON analytics(session_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX idx_analytics_variant ON analytics(messaging_variant);
CREATE INDEX idx_analytics_segments ON analytics USING GIN(customer_segments);

-- Update waitlist table to track segments and messaging
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS detected_segments TEXT[];
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS messaging_variant CHAR(1);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS conversion_source VARCHAR(100);

-- View for segment analysis
CREATE VIEW segment_performance AS
SELECT 
  segment,
  COUNT(*) as total_conversions,
  AVG(CASE WHEN budget = 'premium' OR budget = 'high' THEN 1 ELSE 0 END) as premium_rate,
  AVG(CASE WHEN yard_size IN ('large', 'xlarge') THEN 1 ELSE 0 END) as large_yard_rate
FROM waitlist, unnest(detected_segments) AS segment
GROUP BY segment;

-- View for messaging performance
CREATE VIEW messaging_performance AS
SELECT 
  messaging_variant,
  COUNT(*) as conversions,
  AVG(CASE WHEN budget IN ('premium', 'high') THEN 1 ELSE 0 END) as high_value_rate,
  COUNT(DISTINCT zip_code) as geographic_spread
FROM waitlist
WHERE messaging_variant IS NOT NULL
GROUP BY messaging_variant;
