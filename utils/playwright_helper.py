from playwright.sync_api import sync_playwright
from config.settings import HEADLESS, SLOW_MO, BROWSER_TYPE
from utils.logger import get_logger

logger = get_logger(__name__)


class PlaywrightHelper:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None

    def start(self):
        """Start Playwright and browser"""
        try:
            self.playwright = sync_playwright().start()
            logger.info(f"Starting {BROWSER_TYPE} browser (headless={HEADLESS})")

            if BROWSER_TYPE == "chromium":
                self.browser = self.playwright.chromium.launch(headless=HEADLESS, slow_mo=SLOW_MO)
            elif BROWSER_TYPE == "firefox":
                self.browser = self.playwright.firefox.launch(headless=HEADLESS, slow_mo=SLOW_MO)
            elif BROWSER_TYPE == "webkit":
                self.browser = self.playwright.webkit.launch(headless=HEADLESS, slow_mo=SLOW_MO)
            else:
                raise ValueError(f"Unsupported browser type: {BROWSER_TYPE}")

            self.context = self.browser.new_context()
            self.page = self.context.new_page()
            logger.info("Browser started successfully")
            return self.page
        except Exception as e:
            logger.error(f"Failed to start Playwright: {str(e)}")
            raise

    def stop(self):
        """Stop Playwright and browser"""
        try:
            if self.page:
                self.page.close()
            if self.context:
                self.context.close()
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()
            logger.info("Browser stopped successfully")
        except Exception as e:
            logger.error(f"Error stopping Playwright: {str(e)}")
            raise

    def navigate(self, url):
        """Navigate to URL"""
        try:
            logger.info(f"Navigating to {url}")
            self.page.goto(url)
        except Exception as e:
            logger.error(f"Failed to navigate to {url}: {str(e)}")
            raise

    def fill_input(self, selector, text):
        """Fill input field"""
        try:
            logger.debug(f"Filling input {selector} with text")
            self.page.fill(selector, text)
        except Exception as e:
            logger.error(f"Failed to fill input {selector}: {str(e)}")
            raise

    def click(self, selector):
        """Click on element"""
        try:
            logger.debug(f"Clicking element {selector}")
            self.page.click(selector)
        except Exception as e:
            logger.error(f"Failed to click {selector}: {str(e)}")
            raise

    def wait_for_selector(self, selector, timeout=5000):
        """Wait for element to appear"""
        try:
            logger.debug(f"Waiting for element {selector}")
            self.page.wait_for_selector(selector, timeout=timeout)
        except Exception as e:
            logger.error(f"Element {selector} did not appear: {str(e)}")
            raise

    def get_text(self, selector):
        """Get text content of element"""
        try:
            text = self.page.text_content(selector)
            logger.debug(f"Got text from {selector}: {text}")
            return text
        except Exception as e:
            logger.error(f"Failed to get text from {selector}: {str(e)}")
            raise
