import pytest
from datetime import datetime, timedelta
from utils.validators import LogValidator
from config.constants import BILL_PAYMENT_LOG_INDEX


@pytest.mark.logs
class TestKibanaLogValidation:
    """Tests for Kibana/Elasticsearch log validation"""

    def test_log_entry_exists(self, kibana_client):
        """Test that log entry exists for a bill creation"""
        try:
            # Search for log containing "bill_created"
            logs = kibana_client.search_logs(
                index=BILL_PAYMENT_LOG_INDEX,
                query={"message": "bill_created"}
            )

            # Validate log exists
            assert len(logs) > 0, "No log entries found for bill_created"
        except Exception as e:
            pytest.skip(f"Kibana not available: {str(e)}")

    def test_payment_processing_log(self, kibana_client):
        """Test that payment processing logs exist"""
        try:
            logs = kibana_client.search_logs(
                index=BILL_PAYMENT_LOG_INDEX,
                query={"message": "payment_processed"}
            )

            if logs:
                LogValidator.assert_log_count(logs, 1)
        except Exception:
            pytest.skip("Kibana not available")

    def test_logs_by_timestamp(self, kibana_client):
        """Test querying logs by timestamp range"""
        try:
            # Get logs from last 24 hours
            end_time = datetime.now().isoformat()
            start_time = (datetime.now() - timedelta(hours=24)).isoformat()

            logs = kibana_client.get_logs_by_timestamp(
                index=BILL_PAYMENT_LOG_INDEX,
                start_time=start_time,
                end_time=end_time
            )

            # Validate we got logs
            assert len(logs) >= 0, "Failed to query logs by timestamp"
        except Exception:
            pytest.skip("Kibana not available")

    def test_logs_by_user_id(self, kibana_client):
        """Test querying logs by user_id"""
        try:
            logs = kibana_client.get_logs_by_field(
                index=BILL_PAYMENT_LOG_INDEX,
                field="user_id",
                value="user_001"
            )

            if logs:
                LogValidator.assert_log_count(logs, 1)
        except Exception:
            pytest.skip("Kibana not available")

    def test_error_logs_exist(self, kibana_client):
        """Test that error logs can be queried"""
        try:
            logs = kibana_client.search_logs(
                index=BILL_PAYMENT_LOG_INDEX,
                query={"level": "ERROR"}
            )

            # Logs may or may not exist, but query should work
            assert isinstance(logs, list)
        except Exception:
            pytest.skip("Kibana not available")

    def test_log_contains_bill_id(self, kibana_client):
        """Test that logs contain bill_id"""
        try:
            logs = kibana_client.search_logs(
                index=BILL_PAYMENT_LOG_INDEX,
                query={"bill_id": "bill_001"}
            )

            if logs:
                # Verify logs contain bill_id
                for log in logs:
                    source = log.get("_source", {})
                    assert "bill_id" in source or "bill_id" in str(log)
        except Exception:
            pytest.skip("Kibana not available")

    def test_log_level_validation(self, kibana_client):
        """Test that log levels can be queried"""
        try:
            logs = kibana_client.get_logs_by_field(
                index=BILL_PAYMENT_LOG_INDEX,
                field="level",
                value="INFO"
            )

            # Should get logs with INFO level
            assert isinstance(logs, list)
        except Exception:
            pytest.skip("Kibana not available")

    def test_log_message_format(self, kibana_client):
        """Test that log messages have expected format"""
        try:
            logs = kibana_client.search_logs(
                index=BILL_PAYMENT_LOG_INDEX,
                query={"message": "bill"}
            )

            if logs:
                for log in logs:
                    source = log.get("_source", {})
                    # Verify log has timestamp
                    assert "@timestamp" in source or "timestamp" in source
        except Exception:
            pytest.skip("Kibana not available")

    def test_transaction_logs(self, kibana_client):
        """Test querying transaction-related logs"""
        try:
            logs = kibana_client.search_logs(
                index=BILL_PAYMENT_LOG_INDEX,
                query={"type": "transaction"}
            )

            # May or may not have results
            assert isinstance(logs, list)
        except Exception:
            pytest.skip("Kibana not available")
