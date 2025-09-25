-- PostgreSQL initialization script for FFXI Crawler
-- This script runs automatically when the container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- The bg_wiki_pages table will be created automatically by TypeORM
-- This script is mainly for any additional setup needed

-- Create indexes for better performance (TypeORM will create the main ones)
-- Note: These will be created after TypeORM creates the tables

-- Function to create indexes after table creation
CREATE OR REPLACE FUNCTION create_crawler_indexes() RETURNS void AS $$
BEGIN
    -- Check if the table exists before creating indexes
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bg_wiki_pages') THEN

        -- Create additional indexes for performance
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bg_wiki_pages_last_crawled
        ON bg_wiki_pages(last_crawled);

        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bg_wiki_pages_created_at
        ON bg_wiki_pages(created_at);

        -- Partial index for recently crawled pages
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bg_wiki_pages_recent
        ON bg_wiki_pages(last_crawled)
        WHERE last_crawled > NOW() - INTERVAL '7 days';

        RAISE NOTICE 'Crawler indexes created successfully';
    ELSE
        RAISE NOTICE 'bg_wiki_pages table does not exist yet - indexes will be created by application';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get crawler statistics
CREATE OR REPLACE FUNCTION get_crawler_stats() RETURNS TABLE(
    total_pages bigint,
    pages_last_24h bigint,
    pages_last_week bigint,
    oldest_crawl timestamp with time zone,
    newest_crawl timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_pages,
        COUNT(CASE WHEN last_crawled > NOW() - INTERVAL '24 hours' THEN 1 END) as pages_last_24h,
        COUNT(CASE WHEN last_crawled > NOW() - INTERVAL '7 days' THEN 1 END) as pages_last_week,
        MIN(last_crawled) as oldest_crawl,
        MAX(last_crawled) as newest_crawl
    FROM bg_wiki_pages;
END;
$$ LANGUAGE plpgsql;

-- Database initialization completed
DO $$ BEGIN
    RAISE NOTICE 'FFXI Crawler database initialization completed';
END $$;