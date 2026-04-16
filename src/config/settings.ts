import * as dotenv from 'dotenv';

dotenv.config();

export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
  timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
};

export const mongoConfig = {
  host: process.env.MONGO_HOST || 'localhost',
  port: parseInt(process.env.MONGO_PORT || '27017', 10),
  database: process.env.MONGO_DATABASE || 'bill_payment',
  username: process.env.MONGO_USERNAME || '',
  password: process.env.MONGO_PASSWORD || '',
};

export const elasticsearchConfig = {
  host: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
};

export const kibanaConfig = {
  host: process.env.KIBANA_HOST || 'http://localhost:5601',
  username: process.env.KIBANA_USERNAME || '',
  password: process.env.KIBANA_PASSWORD || '',
};

export const browserConfig = {
  headless: process.env.HEADLESS === 'true',
  slowMo: parseInt(process.env.SLOW_MO || '100', 10),
  browserType: process.env.BROWSER_TYPE || 'chromium',
};

export const logConfig = {
  level: process.env.LOG_LEVEL || 'info',
};

export function getMongoConnectionString(): string {
  if (mongoConfig.username && mongoConfig.password) {
    return `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`;
  }
  return `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`;
}

export function getElasticsearchAuth(): {
  username: string;
  password: string;
} | undefined {
  if (kibanaConfig.username && kibanaConfig.password) {
    return {
      username: kibanaConfig.username,
      password: kibanaConfig.password,
    };
  }
  return undefined;
}
