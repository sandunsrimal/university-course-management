package com.erp.course.backend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.backoff.FixedBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Logger;

@Configuration
@EnableRetry
@Profile("render")
public class DatabaseConfig {

    private static final Logger logger = Logger.getLogger(DatabaseConfig.class.getName());

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        
        // Configure retry policy - retry up to 10 times
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(10);
        retryTemplate.setRetryPolicy(retryPolicy);
        
        // Configure backoff policy - wait 5 seconds between retries
        FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
        backOffPolicy.setBackOffPeriod(5000L);
        retryTemplate.setBackOffPolicy(backOffPolicy);
        
        return retryTemplate;
    }

    @Component
    @Profile("render")
    public static class DatabaseHealthChecker {
        
        private final DataSource dataSource;
        private final RetryTemplate retryTemplate;
        
        public DatabaseHealthChecker(DataSource dataSource, RetryTemplate retryTemplate) {
            this.dataSource = dataSource;
            this.retryTemplate = retryTemplate;
        }
        
        @Retryable(value = {SQLException.class}, maxAttempts = 10, backoff = @org.springframework.retry.annotation.Backoff(delay = 5000))
        public boolean checkDatabaseConnection() {
            try {
                logger.info("Checking database connection...");
                Connection connection = dataSource.getConnection();
                boolean isValid = connection.isValid(30);
                connection.close();
                
                if (isValid) {
                    logger.info("Database connection is healthy");
                    return true;
                } else {
                    logger.warning("Database connection is not valid");
                    throw new SQLException("Database connection is not valid");
                }
            } catch (SQLException e) {
                logger.severe("Database connection failed: " + e.getMessage());
                throw new RuntimeException("Database connection failed", e);
            }
        }
    }
} 