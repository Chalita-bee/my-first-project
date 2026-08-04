export class ApiHeaders {
  static getHeaders_STEL_SIT(): any {
    const IdGenerator = require('../utils/idGenerator').default;
    const requestId = IdGenerator.generateRequestId();

    return {
      resourceOwnerID: 'ST75725',
      'X-Request-ID': requestId,
      'X-Channel': 'STEL',
      correlationId: requestId,
      requestUID: requestId,
      sourceSystem: 'STEL',
      apikey: 'xx15cabel788695b41e58dfbfd0d596339b3',
      apisecret: '600aa34ee073d048ab3417aa9c9dc7a3',
    };
  }

  static getHeaders_ENET_SIT(): any {
    const IdGenerator = require('../utils/idGenerator').default;
    const requestId = IdGenerator.generateRequestId();

    return {
      correlationId: requestId,
      requestUID: requestId,
      sourceSystem: 'ENET',
      originalSystem: 'ENET',
      apikey: 'CieFohghooV8Eesaingie0Eequaafahcho4u',
      apisecret: 'roh0ahTohtoos6Woo4thai9queekiuqu',
    };
  }
}

export class InqPaymentPayloads {
  static inqPaymentPayloadWith_9112_Account(): any {
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

  static inqPaymentPayloadWith_9112_Account_TaxID(): any {
    return {
      tranCode: 'BLPY',
      terminalNo: 'WS01',
      bankCode: '14',
      bankName: 'SCB',
      processingBranch: '0111',
      accountDeposit: {
        accountId: '1113932176',
        accountCurrency: '764',
      },
      remittanceInfo: {
        transAmount: {
          amount: 85.6,
        },
      },
      userTranCode: '9112',
      taxId: '00099400024474690',
      cardRec: [
        {
          customerId: '11860050854',
          refNumber: '1186580073607',
        },
      ],
    };
  }

  static inqPaymentPayloadWith_9113_Account(): any {
    return {
      tranCode: 'BLPY',
      terminalNo: 'WS01',
      bankCode: '14',
      bankName: 'SCB',
      processingBranch: '0111',
      accountDeposit: {
        accountId: '4230200092',
        accountType: '3',
        accountCurrency: '764',
      },
      remittanceInfo: {
        transAmount: {
          amount: 200,
        },
      },
      userTranCode: '9113',
      cardRec: [
        {
          customerId: '1234567890258',
        },
      ],
      chequeInfo: {
        postDate: '2025-09-29',
        bankCode: '1',
      },
    };
  }

  static inqPaymentPayloadWith_9110_CompCode(): any {
    return {
      tranCode: 'BLPY',
      terminalNo: 'WS01',
      bankCode: '14',
      bankName: 'SCB',
      processingBranch: '0111',
      remittanceInfo: {
        transAmount: {
          amount: 100,
        },
      },
      userTranCode: '9110',
      compCode: '3355',
      cardRec: [
        {
          customerId: '11860050854',
          refNumber: '1186580073607',
        },
      ],
    };
  }

  static inqPaymentPayloadWith_9110_TaxId(): any {
    return {
      tranCode: 'BLPY',
      terminalNo: 'WS01',
      bankCode: '14',
      bankName: 'SCB',
      processingBranch: '0111',
      remittanceInfo: {
        transAmount: {
          amount: 0,
        },
      },
      userTranCode: '9110',
      taxId: '099400024474690',
      cardRec: [
        {
          customerId: '11860050854',
          refNumber: '1186580073607',
        },
      ],
    };
  }
}

export class TellerTotalCCPayloads {
  static inqTellerTotalCCPayloadWithTellerId(): any {
    return {
      tranType: 'INQTELLERTOTALCC',
      terminalNo: '',
      bankCode: '14',
      bankName: '',
      deviceId: '',
      processingBranch: '0111',
      overrideFlag: '1',
      currencyCode: '764',
      tellerId: 'ST75725',
      location: '0111',
      bdrType: '',
    };
  }

  static inqTellerTotalCCPayloadWithBranchId(): any {
    return {
      tranType: 'INQBRANCHTOTALCC',
      terminalNo: '',
      bankCode: '14',
      bankName: '',
      deviceId: '',
      processingBranch: '0111',
      overrideFlag: '1',
      currencyCode: '764',
      tellerId: '',
      location: '0111',
      bdrType: '',
    };
  }
}

export class DepAcctActivityInfoInqPayloads {
  static depAcctActivityInfoInqPayload(): any {
    return {
      productCode: 'STEL',
      subProductCode: null,
      tranCode: null,
      terminalNumber: null,
      bankCode: '14',
      bankName: null,
      branchId: '0001',
      deviceId: null,
      overrideFlag: null,
      accountNumber: null,
      currencyType: null,
      currencyCode: '764',
      inquiryCode: 'T',
      inquiryTranCode: '',
      fromTime: '09:00',
      toTime: '10:00',
      pagingOffset: null,
    };
  }
}

export class PaySvcPayloads {
  static verifyBillPaymentViaENETWithAtomicSUN(rqUID?: string): any {
    if (!rqUID) {
      const IdGenerator = require('../utils/idGenerator').default;
      rqUID = IdGenerator.generateRequestId();
    }

    return {
      RqUID: rqUID,
      CustId: {
        SPName: 'ENET',
        CustPermId: '',
        CustLoginId: '',
      },
      TranInfo: {
        TranType: 'PAYMENTVERIFY',
        ProdCode: 'ENET',
        TranCode: 'BLPY',
      },
      TranOwner: {
        TerminalNo: '1147',
      },
      PmtInfo: {
        PmtAmt: '100.0',
        PayerInfo: {
          Name: '',
        },
        PmtInstType: 'ETFR',
        DepAcctIdFrom: {
          AcctId: '4310062487',
          AcctType: 'DPA',
          AcctCur: '764',
          BankInfo: {
            BankId: '14',
            BranchId: '1111',
            BranchRegion: '001',
            BranchName: 'test',
          },
        },
      },
      BillRec: {
        BillerInfo: {
          BillerAcctId: {
            AcctId: '4230200092',
            AcctType: 'DPA',
          },
          BillerCompCode: '00092',
          BillerName: '',
        },
        BillRefInfo: {
          BillRef1: '0830443596',
          BillRef2: '0830443596',
        },
        BillerPostingDt: '20250520',
      },
      PrcDt: '',
    };
  }
}
