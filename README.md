# Bill Payment API Test Automation - Node.js/TypeScript

Comprehensive test automation framework for Bill Payment System API using Playwright, Jest, and TypeScript with MongoDB validation and Kibana log analysis.

## Project Structure

```
my-first-project-nodejs/
├── src/
│   ├── config/              # Configuration
│   │   ├── settings.ts      # Environment settings & credentials
│   │   └── constants.ts     # Test constants
│   ├── utils/               # Utility modules
│   │   ├── apiClient.ts     # HTTP client wrapper
│   │   ├── mongoClient.ts   # MongoDB client
│   │   ├── kibanaClient.ts  # Elasticsearch client
│   │   ├── playwrightHelper.ts  # Browser automation
│   │   ├── logger.ts        # Logging setup
│   │   └── validators.ts    # Custom assertions
│   ├── fixtures/            # Test data
│   │   ├── testData.ts      # Sample test data
│   │   └── apiPayloads.ts   # API request payloads
│   └── helpers/             # Test helpers
│       └── setupTests.ts    # Global setup
│
├── tests/                   # Test suites
│   ├── api/                 # API tests
│   │   └── billPayment.test.ts
│   ├── database/            # Database tests
│   │   └── mongoValidation.test.ts
│   └── logs/                # Log validation tests
│       └── kibanaValidation.test.ts
│
├── reports/                 # Test reports (auto-generated)
│   ├── coverage/
│   ├── html/
│   └── json/
│
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── jest.config.ts           # Jest configuration
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── README.md               # Project documentation
└── KIBANA_CONFIGURATION.md # Kibana setup and usage guide
```

## Requirements

- Node.js 16+ (or 18+, 20+)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Chalita-bee/my-first-project.git
cd my-first-project/my-first-project-nodejs
```

### 2. Install dependencies

```bash
npm install
```

or with yarn:

```bash
yarn install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

Edit `.env` file with your actual settings:

```env
# API Configuration
API_BASE_URL=http://localhost:8080
API_TIMEOUT=30000

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=bill_payment
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password

# Elasticsearch/Kibana Configuration
ELASTICSEARCH_HOST=http://localhost:9200
KIBANA_HOST=http://localhost:5601
KIBANA_USERNAME=your_username
KIBANA_PASSWORD=your_password

# Browser Configuration
HEADLESS=true
SLOW_MO=100
BROWSER_TYPE=chromium

# Logging
LOG_LEVEL=info
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run specific test category

```bash
# API tests only
npm run test:api

# Database tests only
npm run test:database

# Log validation tests only
npm run test:logs
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

## Test Reports

After running tests, reports are available at:

- **HTML Report:** `reports/html/report.html` - Open in browser
- **Coverage Report:** `reports/coverage/lcov-report/index.html`
- **JSON Report:** Check Jest output

## API Tests (`tests/api/billPayment.test.ts`)

- Create bill successfully
- Get bill by ID
- Get bills by user
- Update bill status
- Process payment
- Batch bill creation
- Delete bill

## Database Tests (`tests/database/mongoValidation.test.ts`)

- Find bill documents
- Verify bill document fields
- Validate bill amount
- Query bills by user
- Insert bill document
- Update bill status
- Find payment records
- Count bills by user
- Delete test bill

## Log Tests (`tests/logs/kibanaValidation.test.ts`)

- Find log entries for bill creation
- Find payment processing logs
- Query logs by timestamp
- Query logs by user_id
- Find error logs
- Verify log contains bill_id
- Query logs by level
- Verify log message format
- Query transaction logs

## Writing New Tests

### Example API Test

```typescript
test('should get user profile', async () => {
  const response = await apiClient.get('/api/users/user_001');
  ResponseValidator.assertStatusCode(response, HTTP_STATUS.OK);
  expect(response.data).toHaveProperty('name');
});
```

### Example Database Test

```typescript
test('should find user in database', async () => {
  const user = await mongoClient.findOne('users', { user_id: 'user_001' });
  DatabaseValidator.assertDocumentExists(user);
  expect(user.email).toBeDefined();
});
```

### Example Log Test

```typescript
test('should find login logs', async () => {
  const logs = await kibanaClient.searchLogs('logs-*', { action: 'login' });
  LogValidator.assertLogExists(logs, 'successful');
});
```

## Available Scripts

```bash
npm test              # Run all tests
npm run test:api      # Run API tests
npm run test:database # Run database tests
npm run test:logs     # Run log tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run build         # Compile TypeScript
npm run dev           # Run with ts-node
npm run clean         # Remove build artifacts
```

## Project Structure Benefits

### Type Safety
- Full TypeScript support with strict mode enabled
- Type definitions for all external libraries
- Better IDE support and autocomplete

### Modularity
- Separated concerns (config, utils, fixtures, tests)
- Easy to extend and maintain
- Reusable utilities and fixtures

### Comprehensive Testing
- API endpoint testing
- Database validation
- Log analysis
- Multiple test suites

### Reporting
- HTML reports for visual inspection
- JSON reports for CI/CD integration
- Coverage reports

## Kibana Integration

The framework includes advanced Kibana integration for log validation:

- **Correlation ID Search**: Query logs by correlationId, requestUID, or X-Request-ID
- **Environment Filtering**: Automatically filter logs by environment (default: alpha)
- **Multi-Field Queries**: Complex queries with multiple field filters
- **Timestamp Ranges**: Query logs within specific time ranges

See [KIBANA_CONFIGURATION.md](./KIBANA_CONFIGURATION.md) for detailed setup and usage instructions.

### Quick Kibana Example

```typescript
const kibanaClient = new KibanaClient();
await kibanaClient.connect();

const logs = await kibanaClient.getLogsByCorrelationId(
  'logs-bill-payment-*',
  'BE69041607114c8adb0e42',
  { env: 'alpha' }
);

console.log(`Found ${logs.length} logs`);
await kibanaClient.disconnect();
```

## Troubleshooting

### "Cannot find module" errors

```bash
npm install
npm run build
```

### Playwright browser not found

```bash
npx playwright install
```

### MongoDB connection failed

- Verify MongoDB is running
- Check connection string in `.env`
- Verify firewall allows connection

### Kibana connection failed

- Verify Elasticsearch is running
- Check credentials in `.env`
- Verify host/port are correct
- See [KIBANA_CONFIGURATION.md](./KIBANA_CONFIGURATION.md) for troubleshooting

### Jest configuration errors

```bash
npm install --save-dev ts-jest @types/jest
```

## Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Add new test cases"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

## Best Practices

1. **Organize tests** - Keep related tests in the same file
2. **Use fixtures** - Create reusable test data with factories
3. **Clear assertions** - Use custom validators for consistency
4. **Logging** - Enable debug logging to understand test flow
5. **Error handling** - Gracefully handle missing services
6. **Documentation** - Keep test names and comments clear

## Contributing

1. Create a feature branch: `git checkout -b feature/test-name`
2. Add your tests
3. Run all tests: `npm test`
4. Commit: `git commit -m "Add tests for feature"`
5. Push: `git push origin feature/test-name`
6. Create pull request on GitHub

## License

MIT

## Contact

For questions or issues, please create an issue on GitHub.
