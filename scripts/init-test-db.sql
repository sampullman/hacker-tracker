-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test database
CREATE DATABASE hacker_tracker_test;
GRANT ALL PRIVILEGES ON DATABASE hacker_tracker_test TO postgres;