export class BillPaymentPayloads {
  static createBillPayload(): any {
    return {
      user_id: 'user_001',
      amount: 1000.0,
      currency: 'USD',
      description: 'Test Bill Payment',
      bill_date: '2024-04-16',
    };
  }

  static updateBillPayload(): any {
    return {
      amount: 1500.0,
      status: 'approved',
    };
  }

  static processPaymentPayload(): any {
    return {
      bill_id: 'bill_001',
      payment_method: 'credit_card',
      amount: 1000.0,
      reference_id: 'ref_001',
    };
  }

  static batchBillPayload(): any {
    return {
      bills: [
        {
          user_id: 'user_001',
          amount: 500.0,
          currency: 'USD',
          description: 'Bill 1',
        },
        {
          user_id: 'user_002',
          amount: 750.0,
          currency: 'USD',
          description: 'Bill 2',
        },
        {
          user_id: 'user_003',
          amount: 1000.0,
          currency: 'USD',
          description: 'Bill 3',
        },
      ],
    };
  }
}

export class QueryPayloads {
  static getBillById(): any {
    return {
      bill_id: 'bill_001',
    };
  }

  static getBillsByUser(): any {
    return {
      user_id: 'user_001',
    };
  }

  static getBillsByDateRange(): any {
    return {
      start_date: '2024-01-01',
      end_date: '2024-04-16',
    };
  }
}
