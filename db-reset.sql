-- WARNING: This script will delete all data from the database
-- Make sure you have a backup before running this script if you want to restore the data later

-- Disable foreign key checks temporarily to allow truncating tables with relationships
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all tables
TRUNCATE TABLE assessment;
TRUNCATE TABLE cart;
TRUNCATE TABLE course;
TRUNCATE TABLE feedback;
TRUNCATE TABLE learning;
TRUNCATE TABLE user;
-- Add any other tables in your database here

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Optional: Add a confirmation message
SELECT 'All data has been deleted from the database. The schema structure remains intact.' AS 'Confirmation'; 