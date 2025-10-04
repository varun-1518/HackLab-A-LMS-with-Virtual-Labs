# Database Reset Instructions

This document explains how to safely reset (delete all data from) the LMS database.

## ⚠️ WARNING

**This operation will delete ALL data from your database.** Before proceeding:
- Make sure you have a backup if you might need the data later
- Understand that this operation cannot be undone
- Stop the application before resetting the database

## Instructions

### Option 1: Using MySQL Command Line

1. Open your terminal or command prompt
2. Navigate to the directory containing `db-reset.sql`
3. Connect to MySQL with the following command:
   ```
   mysql -u root -p
   ```
   (If you have a password, you'll be prompted to enter it)
4. Select the LMS database:
   ```
   USE lms;
   ```
5. Run the reset script:
   ```
   SOURCE db-reset.sql;
   ```
6. You should see a confirmation message if successful

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database server
3. Select the LMS database by double-clicking it
4. Open the `db-reset.sql` file
5. Click the lightning bolt icon to execute the script
6. You should see a confirmation message in the output panel

## Restarting the Application

After resetting the database:

1. The database schema will remain intact (tables, columns, etc.)
2. All data will be removed from all tables
3. The application can be restarted, and it will work with an empty database
4. You'll need to create new users, courses, etc.

## Troubleshooting

If you encounter errors:

1. Make sure all tables mentioned in the script exist in your database
2. Ensure MySQL user has sufficient privileges (root access recommended)
3. Check that the application is stopped before running the script
4. Verify you're connected to the correct database 