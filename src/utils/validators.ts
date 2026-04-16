import { AxiosResponse } from 'axios';
import logger from './logger';

export class ResponseValidator {
  static assertStatusCode(response: AxiosResponse, expectedStatus: number): void {
    const actualStatus = response.status;
    if (actualStatus !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${actualStatus}`);
    }
    logger.info(`Status code validation passed: ${actualStatus}`);
  }

  static assertResponseContainsKey(response: AxiosResponse, key: string): any {
    const jsonResponse = response.data;
    if (!(key in jsonResponse)) {
      throw new Error(
        `Response does not contain key '${key}'. Response: ${JSON.stringify(jsonResponse)}`
      );
    }
    logger.info(`Response contains key '${key}'`);
    return jsonResponse[key];
  }

  static assertResponseEquals(response: AxiosResponse, expectedValue: any, key?: string): void {
    const jsonResponse = response.data;
    const actualValue = key ? jsonResponse[key] : jsonResponse;
    if (actualValue !== expectedValue) {
      throw new Error(`Expected ${expectedValue}, got ${actualValue}`);
    }
    logger.info(`Response value validation passed`);
  }

  static assertJsonContains(jsonData: any, expectedKeys: string[]): void {
    for (const key of expectedKeys) {
      if (!(key in jsonData)) {
        throw new Error(
          `JSON does not contain key '${key}'. Keys found: ${Object.keys(jsonData)}`
        );
      }
    }
    logger.info(`JSON validation passed: contains all ${expectedKeys.length} keys`);
  }
}

export class DatabaseValidator {
  static assertDocumentExists(document: any, message: string = 'Document does not exist'): void {
    if (document === null || document === undefined) {
      throw new Error(message);
    }
    logger.info('Document found in database');
  }

  static assertFieldValue(document: any, field: string, expectedValue: any): void {
    const actualValue = document[field];
    if (actualValue !== expectedValue) {
      throw new Error(
        `Field '${field}' expected ${expectedValue}, got ${actualValue}`
      );
    }
    logger.info(`Field '${field}' validation passed: ${actualValue}`);
  }

  static assertDocumentCount(documents: any[], expectedCount: number): void {
    const actualCount = documents.length;
    if (actualCount !== expectedCount) {
      throw new Error(`Expected ${expectedCount} documents, got ${actualCount}`);
    }
    logger.info(`Document count validation passed: ${actualCount}`);
  }
}

export class LogValidator {
  static assertLogExists(logs: any[], searchTerm: string): void {
    const logContents = logs.map(log => JSON.stringify(log));
    const found = logContents.some(log => log.includes(searchTerm));
    if (!found) {
      throw new Error(`Log entry containing '${searchTerm}' not found`);
    }
    logger.info(`Log validation passed: found '${searchTerm}'`);
  }

  static assertLogCount(logs: any[], expectedCount: number): void {
    const actualCount = logs.length;
    if (actualCount < expectedCount) {
      throw new Error(`Expected at least ${expectedCount} logs, got ${actualCount}`);
    }
    logger.info(`Log count validation passed: ${actualCount} logs found`);
  }

  static assertLogFieldValue(logs: any[], fieldName: string, expectedValue: any): boolean {
    for (const log of logs) {
      if (log[fieldName] === expectedValue) {
        logger.info(`Log field validation passed: ${fieldName}=${expectedValue}`);
        return true;
      }
    }
    throw new Error(`No log found with ${fieldName}=${expectedValue}`);
  }
}
