import { TEST_DATA } from '../config/constants';

export class TestDataFactory {
  static createBillPaymentData(
    userId: string = TEST_DATA.DEFAULT_USER_ID,
    amount: number = TEST_DATA.DEFAULT_BILL_AMOUNT,
    currency: string = TEST_DATA.DEFAULT_CURRENCY,
    description: string = TEST_DATA.DEFAULT_BILL_DESCRIPTION
  ): any {
    return {
      user_id: userId,
      amount,
      currency,
      description,
      status: 'pending',
    };
  }

  static createMultipleBills(count: number = 3): any[] {
    const bills = [];
    for (let i = 0; i < count; i++) {
      bills.push({
        user_id: `user_${String(i).padStart(3, '0')}`,
        amount: TEST_DATA.DEFAULT_BILL_AMOUNT + i * 100,
        currency: TEST_DATA.DEFAULT_CURRENCY,
        description: `Test Bill ${i + 1}`,
        status: 'pending',
      });
    }
    return bills;
  }

  static createUserData(userId: string = TEST_DATA.DEFAULT_USER_ID): any {
    return {
      user_id: userId,
      name: `Test User ${userId}`,
      email: `${userId}@example.com`,
      is_active: true,
    };
  }
}

// Sample test data instances
export const SAMPLE_BILL_PAYMENT = TestDataFactory.createBillPaymentData();
export const SAMPLE_USER = TestDataFactory.createUserData();
export const SAMPLE_BILLS = TestDataFactory.createMultipleBills(3);
