-- Toss Payments Webhook Event Log Table
CREATE TABLE IF NOT EXISTS toss_webhook_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_key VARCHAR(255),
    order_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50),
    amount INT,
    webhook_payload TEXT,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_key_event (payment_key, event_type),
    INDEX idx_unprocessed (processed, error_message)
);
