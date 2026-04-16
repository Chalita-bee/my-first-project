# Bill Payment API Test Automation

Comprehensive test automation framework for Bill Payment System API using Python, Playwright, and pytest with MongoDB validation and Kibana log analysis.

## Project Structure

```
my-first-project/
├── config/                 # Configuration module
│   ├── settings.py        # Environment settings and credentials
│   └── constants.py       # Test constants and default values
│
├── tests/                 # Test suite
│   ├── api/              # API endpoint tests
│   ├── database/         # MongoDB validation tests
│   └── logs/             # Kibana/Elasticsearch log validation
│
├── utils/                # Utility modules
│   ├── api_client.py     # HTTP client wrapper
│   ├── mongo_client.py   # MongoDB client wrapper
│   ├── kibana_client.py  # Elasticsearch/Kibana client
│   ├── playwright_helper.py  # Browser automation utilities
│   ├── logger.py         # Logging configuration
│   └── validators.py     # Custom assertion helpers
│
├── fixtures/             # Test data and fixtures
│   ├── test_data.py      # Sample test data
│   └── api_payloads.py   # Sample API request payloads
│
├── reports/              # Test reports (auto-generated)
│   ├── html/             # HTML reports
│   └── json/             # JSON reports
│
├── conftest.py           # Pytest configuration and fixtures
├── requirements.txt      # Python dependencies
├── pytest.ini           # Pytest configuration
├── .env.example         # Environment variables template
└── .gitignore          # Git ignore rules
```

## Requirements

- Python 3.8+
- pip or conda

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Chalita-bee/my-first-project.git
cd my-first-project
```

2. **Create virtual environment (optional but recommended):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Install Playwright browsers:**
```bash
playwright install
```

5. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

## Environment Configuration

Edit `.env` file with your settings:

```env
# API Configuration
API_BASE_URL=http://localhost:8080
API_TIMEOUT=30

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=bill_payment
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password

# Kibana Configuration
KIBANA_HOST=http://localhost:5601
KIBANA_USERNAME=your_username
KIBANA_PASSWORD=your_password
ELASTICSEARCH_HOST=http://localhost:9200

# Test Configuration
HEADLESS=true
SLOW_MO=100
BROWSER_TYPE=chromium

# Logging
LOG_LEVEL=INFO
```

## Running Tests

### Run all tests:
```bash
pytest
```

### Run specific test category:
```bash
# API tests only
pytest tests/api/ -m api

# Database tests only
pytest tests/database/ -m database

# Log validation tests only
pytest tests/logs/ -m logs
```

### Run tests with verbose output:
```bash
pytest -v
```

### Run specific test file:
```bash
pytest tests/api/test_bill_payment.py
```

### Run specific test function:
```bash
pytest tests/api/test_bill_payment.py::TestBillPaymentAPI::test_create_bill_success
```

## Test Reports

After running tests, reports are generated in:

- **HTML Report:** `reports/html/report.html` - Open in browser
- **JSON Report:** `reports/json/report.json` - Machine-readable format

## Test Coverage

### API Tests (`tests/api/test_bill_payment.py`)
- Create bill successfully
- Get bill by ID
- Get bills by user
- Update bill status
- Process payment
- Batch bill creation
- Delete bill

### Database Tests (`tests/database/test_mongo_validation.py`)
- Verify bill documents in MongoDB
- Query bills by user
- Insert new bill documents
- Update bill status in database
- Validate payment records
- Document count validation
- Data integrity checks

### Log Tests (`tests/logs/test_kibana_validation.py`)
- Verify bill creation logs
- Check payment processing logs
- Query logs by timestamp
- Filter logs by user_id
- Validate log levels
- Transaction log verification

## Writing New Tests

### Example API Test:
```python
def test_new_api_endpoint(self, api_client):
    payload = {"key": "value"}
    response = api_client.post("/api/endpoint", json=payload)
    
    ResponseValidator.assert_status_code(response, 200)
    ResponseValidator.assert_response_contains_key(response, "result_id")
```

### Example Database Test:
```python
def test_new_db_query(self, mongo_client):
    result = mongo_client.find_one("collection_name", {"field": "value"})
    DatabaseValidator.assert_document_exists(result)
    DatabaseValidator.assert_field_value(result, "status", "active")
```

### Example Log Test:
```python
def test_new_log_validation(self, kibana_client):
    logs = kibana_client.search_logs("index_name", query={"message": "keyword"})
    LogValidator.assert_log_exists(logs, "expected_text")
```

## Fixtures and Utilities

### Using Fixtures:
All fixtures are defined in `conftest.py` and available in test functions:
- `api_client` - HTTP client for API testing
- `mongo_client` - MongoDB connection
- `kibana_client` - Elasticsearch connection
- `browser` - Playwright browser instance

### Using Validators:
```python
from utils.validators import ResponseValidator, DatabaseValidator, LogValidator

ResponseValidator.assert_status_code(response, 200)
DatabaseValidator.assert_field_value(doc, "field", "value")
LogValidator.assert_log_exists(logs, "search_term")
```

## Git Workflow

### Add all changes:
```bash
git add .
```

### Commit changes:
```bash
git commit -m "Add new test cases for bill payment"
```

### Push to GitHub:
```bash
git push origin main
```

### Pull latest changes:
```bash
git pull origin main
```

## Troubleshooting

### Playwright browser not found:
```bash
playwright install chromium
```

### MongoDB connection failed:
- Verify MongoDB is running
- Check connection string in `.env`
- Verify firewall allows connection

### Kibana connection failed:
- Verify Elasticsearch is running
- Check credentials in `.env`
- Verify Kibana port is accessible

### Pytest plugins not found:
```bash
pip install pytest-html pytest-json-report
```

## Contributing

1. Create a new branch: `git checkout -b feature/test-name`
2. Add your tests
3. Run tests to verify: `pytest`
4. Commit and push: `git push origin feature/test-name`
5. Create pull request on GitHub

## License

This project is licensed under the MIT License.

## Contact

For questions or issues, please create an issue on GitHub or contact the maintainer.
