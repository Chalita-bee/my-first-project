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

export class InqPaymentPayloads {
  static inqPaymentPayload(): any {
    return {
      tranCode: 'BLPY',
      terminalNo: 'WS01',
      bankCode: '14',
      bankName: 'SCB',
      processingBranch: '0001',
      accountDeposit: {
        accountId: '4230200092',
        accountType: '3',
        accountCurrency: '764',
      },
      remittanceInfo: {
        transAmount: {
          amount: 3000,
        },
      },
      userTranCode: '9112',
      cardRec: [
        {
          customerId: '2587413699514753',
        },
      ],
    };
  }

  static getHeaders(): any {
    const IdGenerator = require('../utils/idGenerator').default;
    const requestId = IdGenerator.generateRequestId();

    return {
      resourceOwnerID: 'ST75725',
      'X-Request-ID': requestId,
      'X-Channel': 'STEL',
      correlationId: requestId,
      requestUID: requestId,
      sourceSystem: 'STEL',
      apikey: 'd2270aa77d4347b49520a7ed9933benz',
      apisecret: 'f1b22b2ac43843acbb3035e793cd7457',
    };
  }

  static inqPaymentWithDifferentAmount(): any {
    return {
      tranCode: 'BLPY',
      terminalNo: 'WS01',
      bankCode: '14',
      bankName: 'SCB',
      processingBranch: '0001',
      accountDeposit: {
        accountId: '4230200092',
        accountType: '3',
        accountCurrency: '764',
      },
      remittanceInfo: {
        transAmount: {
          amount: 5000,
        },
      },
      userTranCode: '9112',
      cardRec: [
        {
          customerId: '2587413699514753',
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
