-- Add student_id column to users table if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='student_id'
    ) THEN
        ALTER TABLE users ADD COLUMN student_id VARCHAR(50) UNIQUE;
    END IF;
END $$;

