# Test Data Constants
DEFAULT_USER_ID = "user_001"
DEFAULT_BILL_AMOUNT = 1000.00
DEFAULT_CURRENCY = "USD"
DEFAULT_BILL_DESCRIPTION = "Test Bill Payment"

# API Response Status Codes
SUCCESS_STATUS = 200
CREATED_STATUS = 201
BAD_REQUEST_STATUS = 400
UNAUTHORIZED_STATUS = 401
NOT_FOUND_STATUS = 404
INTERNAL_ERROR_STATUS = 500

# Request Headers
DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# MongoDB Collections
BILLS_COLLECTION = "bills"
PAYMENTS_COLLECTION = "payments"
TRANSACTIONS_COLLECTION = "transactions"

# Kibana Indices
LOG_INDEX_PATTERN = "logs-*"
BILL_PAYMENT_LOG_INDEX = "logs-bill-payment-*"

# Test Timeouts
API_RESPONSE_TIMEOUT = 10
DB_QUERY_TIMEOUT = 5
LOG_QUERY_TIMEOUT = 10

# Retry Configuration
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds
