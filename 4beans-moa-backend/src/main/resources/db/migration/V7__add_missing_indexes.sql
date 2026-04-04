-- Missing indexes for frequently queried columns
-- Flyway does not support DELIMITER syntax (MySQL CLI only)
-- Using individual ALTER TABLE statements with information_schema checks via SET/PREPARE

SET @dbname = DATABASE();

-- PAYMENT: USER_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'PAYMENT' AND index_name = 'IDX_PAYMENT_USER_ID');
SET @sql = IF(@idx = 0, 'ALTER TABLE PAYMENT ADD INDEX IDX_PAYMENT_USER_ID (USER_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PAYMENT: PARTY_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'PAYMENT' AND index_name = 'IDX_PAYMENT_PARTY_ID');
SET @sql = IF(@idx = 0, 'ALTER TABLE PAYMENT ADD INDEX IDX_PAYMENT_PARTY_ID (PARTY_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PAYMENT: STATUS + DATE + PARTY_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'PAYMENT' AND index_name = 'IDX_PAYMENT_STATUS_DATE');
SET @sql = IF(@idx = 0, 'ALTER TABLE PAYMENT ADD INDEX IDX_PAYMENT_STATUS_DATE (PAYMENT_STATUS, PAYMENT_DATE, PARTY_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- DEPOSIT: USER_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'DEPOSIT' AND index_name = 'IDX_DEPOSIT_USER_ID');
SET @sql = IF(@idx = 0, 'ALTER TABLE DEPOSIT ADD INDEX IDX_DEPOSIT_USER_ID (USER_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- DEPOSIT: PARTY_ID + USER_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'DEPOSIT' AND index_name = 'IDX_DEPOSIT_PARTY_USER');
SET @sql = IF(@idx = 0, 'ALTER TABLE DEPOSIT ADD INDEX IDX_DEPOSIT_PARTY_USER (PARTY_ID, USER_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PARTY: STATUS + START_DATE
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'PARTY' AND index_name = 'IDX_PARTY_STATUS_START');
SET @sql = IF(@idx = 0, 'ALTER TABLE PARTY ADD INDEX IDX_PARTY_STATUS_START (PARTY_STATUS, START_DATE)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PARTY: LEADER_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'PARTY' AND index_name = 'IDX_PARTY_LEADER');
SET @sql = IF(@idx = 0, 'ALTER TABLE PARTY ADD INDEX IDX_PARTY_LEADER (PARTY_LEADER_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PARTY_MEMBER: USER_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'PARTY_MEMBER' AND index_name = 'IDX_PARTY_MEMBER_USER');
SET @sql = IF(@idx = 0, 'ALTER TABLE PARTY_MEMBER ADD INDEX IDX_PARTY_MEMBER_USER (USER_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- SETTLEMENT: LEADER_ID
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'SETTLEMENT' AND index_name = 'IDX_SETTLEMENT_LEADER');
SET @sql = IF(@idx = 0, 'ALTER TABLE SETTLEMENT ADD INDEX IDX_SETTLEMENT_LEADER (PARTY_LEADER_ID)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- SETTLEMENT: STATUS
SET @idx = (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = @dbname AND table_name = 'SETTLEMENT' AND index_name = 'IDX_SETTLEMENT_STATUS');
SET @sql = IF(@idx = 0, 'ALTER TABLE SETTLEMENT ADD INDEX IDX_SETTLEMENT_STATUS (SETTLEMENT_STATUS)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
