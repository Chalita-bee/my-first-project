import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';
import { browserConfig } from '../config/settings';
import logger from './logger';

export class PlaywrightHelper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async start(): Promise<Page> {
    try {
      logger.info(`Starting ${browserConfig.browserType} browser (headless=${browserConfig.headless})`);

      switch (browserConfig.browserType) {
        case 'firefox':
          this.browser = await firefox.launch({
            headless: browserConfig.headless,
            slowMo: browserConfig.slowMo,
          });
          break;
        case 'webkit':
          this.browser = await webkit.launch({
            headless: browserConfig.headless,
            slowMo: browserConfig.slowMo,
          });
          break;
        case 'chromium':
        default:
          this.browser = await chromium.launch({
            headless: browserConfig.headless,
            slowMo: browserConfig.slowMo,
          });
      }

      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
      logger.info('Browser started successfully');
      return this.page;
    } catch (error) {
      logger.error(`Failed to start Playwright: ${error}`);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
      logger.info('Browser stopped successfully');
    } catch (error) {
      logger.error(`Error stopping Playwright: ${error}`);
      throw error;
    }
  }

  async navigate(url: string): Promise<void> {
    try {
      if (!this.page) throw new Error('Page not initialized');
      logger.info(`Navigating to ${url}`);
      await this.page.goto(url);
    } catch (error) {
      logger.error(`Failed to navigate to ${url}: ${error}`);
      throw error;
    }
  }

  async fillInput(selector: string, text: string): Promise<void> {
    try {
      if (!this.page) throw new Error('Page not initialized');
      logger.debug(`Filling input ${selector} with text`);
      await this.page.fill(selector, text);
    } catch (error) {
      logger.error(`Failed to fill input ${selector}: ${error}`);
      throw error;
    }
  }

  async click(selector: string): Promise<void> {
    try {
      if (!this.page) throw new Error('Page not initialized');
      logger.debug(`Clicking element ${selector}`);
      await this.page.click(selector);
    } catch (error) {
      logger.error(`Failed to click ${selector}: ${error}`);
      throw error;
    }
  }

  async waitForSelector(selector: string, timeout: number = 5000): Promise<void> {
    try {
      if (!this.page) throw new Error('Page not initialized');
      logger.debug(`Waiting for element ${selector}`);
      await this.page.waitForSelector(selector, { timeout });
    } catch (error) {
      logger.error(`Element ${selector} did not appear: ${error}`);
      throw error;
    }
  }

  async getText(selector: string): Promise<string | null> {
    try {
      if (!this.page) throw new Error('Page not initialized');
      const text = await this.page.textContent(selector);
      logger.debug(`Got text from ${selector}: ${text}`);
      return text;
    } catch (error) {
      logger.error(`Failed to get text from ${selector}: ${error}`);
      throw error;
    }
  }

  getPage(): Page {
    if (!this.page) throw new Error('Page not initialized');
    return this.page;
  }
}

export default PlaywrightHelper;
