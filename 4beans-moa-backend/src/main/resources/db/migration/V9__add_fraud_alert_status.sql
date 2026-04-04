-- Add status and memo columns to AI_FRAUD_ALERT table
-- MySQL 8.0 does not support ADD COLUMN IF NOT EXISTS

SET @dbname = DATABASE();

SET @stmt = (SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE AI_FRAUD_ALERT ADD COLUMN STATUS VARCHAR(20) DEFAULT ''PENDING''',
    'SELECT ''Column STATUS already exists'''
) FROM information_schema.columns
WHERE table_schema = @dbname AND table_name = 'AI_FRAUD_ALERT' AND column_name = 'STATUS');

PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = (SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE AI_FRAUD_ALERT ADD COLUMN MEMO TEXT',
    'SELECT ''Column MEMO already exists'''
) FROM information_schema.columns
WHERE table_schema = @dbname AND table_name = 'AI_FRAUD_ALERT' AND column_name = 'MEMO');

PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @stmt = (SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE AI_FRAUD_ALERT ADD COLUMN UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    'SELECT ''Column UPDATED_AT already exists'''
) FROM information_schema.columns
WHERE table_schema = @dbname AND table_name = 'AI_FRAUD_ALERT' AND column_name = 'UPDATED_AT');

PREPARE stmt FROM @stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
