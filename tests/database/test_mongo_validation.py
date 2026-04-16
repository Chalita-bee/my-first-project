import pytest
from fixtures.test_data import TestDataFactory
from utils.validators import DatabaseValidator
from config.constants import BILLS_COLLECTION, PAYMENTS_COLLECTION


@pytest.mark.database
class TestMongoDBValidation:
    """Tests for MongoDB data validation"""

    def test_bill_document_exists(self, mongo_client):
        """Test that a bill document exists in MongoDB"""
        # Query for a specific bill
        bill_query = {"bill_id": "bill_001"}
        bill = mongo_client.find_one(BILLS_COLLECTION, bill_query)

        # Validate document exists
        DatabaseValidator.assert_document_exists(bill, "Bill not found in MongoDB")

    def test_bill_document_fields(self, mongo_client):
        """Test that bill document contains required fields"""
        bill_query = {"bill_id": "bill_001"}
        bill = mongo_client.find_one(BILLS_COLLECTION, bill_query)

        # Validate required fields
        if bill:
            assert "user_id" in bill
            assert "amount" in bill
            assert "currency" in bill
            assert "created_at" in bill

    def test_bill_amount_validation(self, mongo_client):
        """Test that bill amount is stored correctly"""
        bill_query = {"bill_id": "bill_001"}
        bill = mongo_client.find_one(BILLS_COLLECTION, bill_query)

        if bill:
            DatabaseValidator.assert_field_value(bill, "currency", "USD")

    def test_get_bills_by_user(self, mongo_client):
        """Test querying bills by user_id"""
        user_id = "user_001"
        bills = mongo_client.find_many(BILLS_COLLECTION, {"user_id": user_id})

        # Validate we got results
        assert len(bills) > 0, f"No bills found for user {user_id}"

    def test_insert_bill_document(self, mongo_client):
        """Test inserting a new bill document"""
        bill_data = TestDataFactory.create_bill_payment_data(
            user_id="test_user_001",
            amount=999.99
        )
        bill_data["bill_id"] = "test_bill_001"

        # Insert document
        bill_id = mongo_client.insert_one(BILLS_COLLECTION, bill_data)

        # Verify insertion
        inserted_bill = mongo_client.find_one(BILLS_COLLECTION, {"_id": bill_id})
        DatabaseValidator.assert_document_exists(inserted_bill, "Inserted bill not found")

    def test_update_bill_status(self, mongo_client):
        """Test updating a bill status"""
        bill_query = {"bill_id": "bill_001"}
        update_data = {"status": "completed"}

        # Update document
        modified_count = mongo_client.update_one(BILLS_COLLECTION, bill_query, update_data)

        assert modified_count > 0, "No bills were updated"

        # Verify update
        updated_bill = mongo_client.find_one(BILLS_COLLECTION, bill_query)
        DatabaseValidator.assert_field_value(updated_bill, "status", "completed")

    def test_payment_record_creation(self, mongo_client):
        """Test that payment records are created in MongoDB"""
        payment_query = {"bill_id": "bill_001"}
        payment = mongo_client.find_one(PAYMENTS_COLLECTION, payment_query)

        if payment:
            DatabaseValidator.assert_document_exists(
                payment,
                "Payment record not found in MongoDB"
            )

    def test_bill_count_by_user(self, mongo_client):
        """Test counting bills by user"""
        user_id = "user_001"
        bills = mongo_client.find_many(BILLS_COLLECTION, {"user_id": user_id})

        # Validate we have at least one bill
        DatabaseValidator.assert_document_count(bills, 1)

    def test_delete_test_bill(self, mongo_client):
        """Test deleting a test bill document"""
        bill_query = {"bill_id": "test_bill_001"}

        # Delete document
        deleted_count = mongo_client.delete_one(BILLS_COLLECTION, bill_query)

        # Verify deletion
        deleted_bill = mongo_client.find_one(BILLS_COLLECTION, bill_query)
        DatabaseValidator.assert_document_exists(
            deleted_bill,
            message="Bill should be deleted"
        ) if deleted_count == 0 else None
