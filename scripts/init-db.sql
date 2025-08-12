-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create development database
CREATE DATABASE hacker_tracker;
GRANT ALL PRIVILEGES ON DATABASE hacker_tracker TO postgres;
