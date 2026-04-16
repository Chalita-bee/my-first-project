from utils.logger import get_logger

logger = get_logger(__name__)


class ResponseValidator:
    """Helper class for validating API responses"""

    @staticmethod
    def assert_status_code(response, expected_status):
        """Assert response status code"""
        actual_status = response.status_code
        assert actual_status == expected_status, \
            f"Expected status {expected_status}, got {actual_status}"
        logger.info(f"Status code validation passed: {actual_status}")

    @staticmethod
    def assert_response_contains_key(response, key):
        """Assert response contains a specific key"""
        json_response = response.json()
        assert key in json_response, \
            f"Response does not contain key '{key}'. Response: {json_response}"
        logger.info(f"Response contains key '{key}'")
        return json_response[key]

    @staticmethod
    def assert_response_equals(response, expected_value, key=None):
        """Assert response value equals expected value"""
        json_response = response.json()
        if key:
            actual_value = json_response.get(key)
        else:
            actual_value = json_response

        assert actual_value == expected_value, \
            f"Expected {expected_value}, got {actual_value}"
        logger.info(f"Response value validation passed")

    @staticmethod
    def assert_json_contains(json_data, expected_keys):
        """Assert JSON contains all expected keys"""
        for key in expected_keys:
            assert key in json_data, \
                f"JSON does not contain key '{key}'. Keys found: {list(json_data.keys())}"
        logger.info(f"JSON validation passed: contains all {len(expected_keys)} keys")


class DatabaseValidator:
    """Helper class for validating database data"""

    @staticmethod
    def assert_document_exists(document, message="Document does not exist"):
        """Assert document exists in database"""
        assert document is not None, message
        logger.info("Document found in database")

    @staticmethod
    def assert_field_value(document, field, expected_value):
        """Assert field value in document"""
        actual_value = document.get(field)
        assert actual_value == expected_value, \
            f"Field '{field}' expected {expected_value}, got {actual_value}"
        logger.info(f"Field '{field}' validation passed: {actual_value}")

    @staticmethod
    def assert_document_count(documents, expected_count):
        """Assert number of documents"""
        actual_count = len(documents)
        assert actual_count == expected_count, \
            f"Expected {expected_count} documents, got {actual_count}"
        logger.info(f"Document count validation passed: {actual_count}")


class LogValidator:
    """Helper class for validating logs"""

    @staticmethod
    def assert_log_exists(logs, search_term):
        """Assert log entry contains search term"""
        log_contents = [str(log) for log in logs]
        found = any(search_term in log for log in log_contents)
        assert found, f"Log entry containing '{search_term}' not found"
        logger.info(f"Log validation passed: found '{search_term}'")

    @staticmethod
    def assert_log_count(logs, expected_count):
        """Assert number of log entries"""
        actual_count = len(logs)
        assert actual_count >= expected_count, \
            f"Expected at least {expected_count} logs, got {actual_count}"
        logger.info(f"Log count validation passed: {actual_count} logs found")

    @staticmethod
    def assert_log_field_value(logs, field_name, expected_value):
        """Assert log field value"""
        for log in logs:
            if isinstance(log, dict) and log.get(field_name) == expected_value:
                logger.info(f"Log field validation passed: {field_name}={expected_value}")
                return True
        assert False, f"No log found with {field_name}={expected_value}"
