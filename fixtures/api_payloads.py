"""Sample API request payloads for testing"""


class BillPaymentPayloads:
    """API payloads for Bill Payment endpoints"""

    @staticmethod
    def create_bill_payload():
        """Sample payload for creating a bill"""
        return {
            "user_id": "user_001",
            "amount": 1000.00,
            "currency": "USD",
            "description": "Test Bill Payment",
            "bill_date": "2024-04-16"
        }

    @staticmethod
    def update_bill_payload():
        """Sample payload for updating a bill"""
        return {
            "amount": 1500.00,
            "status": "approved"
        }

    @staticmethod
    def process_payment_payload():
        """Sample payload for processing payment"""
        return {
            "bill_id": "bill_001",
            "payment_method": "credit_card",
            "amount": 1000.00,
            "reference_id": "ref_001"
        }

    @staticmethod
    def batch_bill_payload():
        """Sample payload for batch bill creation"""
        return {
            "bills": [
                {
                    "user_id": "user_001",
                    "amount": 500.00,
                    "currency": "USD",
                    "description": "Bill 1"
                },
                {
                    "user_id": "user_002",
                    "amount": 750.00,
                    "currency": "USD",
                    "description": "Bill 2"
                },
                {
                    "user_id": "user_003",
                    "amount": 1000.00,
                    "currency": "USD",
                    "description": "Bill 3"
                }
            ]
        }


class QueryPayloads:
    """Sample query payloads"""

    @staticmethod
    def get_bill_by_id():
        """Sample query for getting bill by ID"""
        return {
            "bill_id": "bill_001"
        }

    @staticmethod
    def get_bills_by_user():
        """Sample query for getting bills by user"""
        return {
            "user_id": "user_001"
        }

    @staticmethod
    def get_bills_by_date_range():
        """Sample query for getting bills by date range"""
        return {
            "start_date": "2024-01-01",
            "end_date": "2024-04-16"
        }
