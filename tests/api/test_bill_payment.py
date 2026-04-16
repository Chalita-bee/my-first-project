import pytest
from fixtures.test_data import TestDataFactory
from fixtures.api_payloads import BillPaymentPayloads
from utils.validators import ResponseValidator
from config.constants import SUCCESS_STATUS, CREATED_STATUS


@pytest.mark.api
class TestBillPaymentAPI:
    """Tests for Bill Payment API endpoints"""

    def test_create_bill_success(self, api_client):
        """Test creating a bill successfully"""
        payload = BillPaymentPayloads.create_bill_payload()

        # Make API request
        response = api_client.post("/api/bills", json=payload)

        # Validate response
        ResponseValidator.assert_status_code(response, CREATED_STATUS)
        bill_id = ResponseValidator.assert_response_contains_key(response, "bill_id")

        # Verify response data
        response_data = response.json()
        assert response_data["amount"] == payload["amount"]
        assert response_data["currency"] == payload["currency"]
        assert "created_at" in response_data

    def test_get_bill_success(self, api_client):
        """Test getting a bill by ID"""
        # Assume bill_001 exists (or create one first)
        response = api_client.get("/api/bills/bill_001")

        # Validate response
        ResponseValidator.assert_status_code(response, SUCCESS_STATUS)
        bill_data = response.json()
        assert "bill_id" in bill_data
        assert "user_id" in bill_data
        assert "amount" in bill_data

    def test_get_bills_by_user(self, api_client):
        """Test getting bills for a specific user"""
        user_id = "user_001"
        response = api_client.get(f"/api/bills/user/{user_id}")

        # Validate response
        ResponseValidator.assert_status_code(response, SUCCESS_STATUS)
        response_data = response.json()
        assert "bills" in response_data
        assert isinstance(response_data["bills"], list)

    def test_update_bill_success(self, api_client):
        """Test updating a bill"""
        bill_id = "bill_001"
        payload = BillPaymentPayloads.update_bill_payload()

        response = api_client.put(f"/api/bills/{bill_id}", json=payload)

        # Validate response
        ResponseValidator.assert_status_code(response, SUCCESS_STATUS)
        bill_data = response.json()
        assert bill_data["status"] == payload["status"]

    def test_process_payment(self, api_client):
        """Test processing a payment"""
        payload = BillPaymentPayloads.process_payment_payload()

        response = api_client.post("/api/payments", json=payload)

        # Validate response
        ResponseValidator.assert_status_code(response, CREATED_STATUS)
        payment_data = response.json()
        assert "payment_id" in payment_data
        assert "status" in payment_data

    @pytest.mark.slow
    def test_batch_bill_creation(self, api_client):
        """Test creating multiple bills in batch"""
        payload = BillPaymentPayloads.batch_bill_payload()

        response = api_client.post("/api/bills/batch", json=payload)

        # Validate response
        ResponseValidator.assert_status_code(response, CREATED_STATUS)
        response_data = response.json()
        assert "bill_ids" in response_data
        assert len(response_data["bill_ids"]) == len(payload["bills"])

    def test_delete_bill(self, api_client):
        """Test deleting a bill"""
        bill_id = "bill_001"

        response = api_client.delete(f"/api/bills/{bill_id}")

        # Validate response (could be 200 or 204)
        assert response.status_code in [200, 204]
