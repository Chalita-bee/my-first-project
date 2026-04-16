import logging
from config.settings import LOG_LEVEL

# Create logger
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)

# Create formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Create console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(LOG_LEVEL)
console_handler.setFormatter(formatter)

# Add handler to logger
logger.addHandler(console_handler)

def get_logger(name):
    """Get logger instance for a module"""
    return logging.getLogger(name)
