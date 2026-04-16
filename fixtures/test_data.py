from config.constants import (
    DEFAULT_USER_ID,
    DEFAULT_BILL_AMOUNT,
    DEFAULT_CURRENCY,
    DEFAULT_BILL_DESCRIPTION
)


class TestDataFactory:
    """Factory class for generating test data"""

    @staticmethod
    def create_bill_payment_data(
        user_id=DEFAULT_USER_ID,
        amount=DEFAULT_BILL_AMOUNT,
        currency=DEFAULT_CURRENCY,
        description=DEFAULT_BILL_DESCRIPTION
    ):
        """Create sample bill payment data"""
        return {
            "user_id": user_id,
            "amount": amount,
            "currency": currency,
            "description": description,
            "status": "pending"
        }

    @staticmethod
    def create_multiple_bills(count=3):
        """Create multiple bill payment records"""
        bills = []
        for i in range(count):
            bill = {
                "user_id": f"user_{i:03d}",
                "amount": DEFAULT_BILL_AMOUNT + (i * 100),
                "currency": DEFAULT_CURRENCY,
                "description": f"Test Bill {i+1}",
                "status": "pending"
            }
            bills.append(bill)
        return bills

    @staticmethod
    def create_user_data(user_id=DEFAULT_USER_ID):
        """Create sample user data"""
        return {
            "user_id": user_id,
            "name": f"Test User {user_id}",
            "email": f"{user_id}@example.com",
            "is_active": True
        }


# Sample test data instances
SAMPLE_BILL_PAYMENT = TestDataFactory.create_bill_payment_data()
SAMPLE_USER = TestDataFactory.create_user_data()
SAMPLE_BILLS = TestDataFactory.create_multiple_bills(3)
