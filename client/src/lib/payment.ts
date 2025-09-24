export type PaymentMethodType = "card" | "paypal" | "crypto" | "bank";
export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "other";
export type CryptoType = "bitcoin" | "ethereum" | "usdc" | "other";

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardPaymentMethod extends PaymentMethod {
  type: "card";
  cardDetails: {
    brand: CardBrand;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    cardholderName: string;
    billingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
}

export interface PayPalPaymentMethod extends PaymentMethod {
  type: "paypal";
  paypalDetails: {
    email: string;
    accountId: string;
  };
}

export interface CryptoPaymentMethod extends PaymentMethod {
  type: "crypto";
  cryptoDetails: {
    cryptoType: CryptoType;
    walletAddress: string;
    network: string;
  };
}

export interface BankPaymentMethod extends PaymentMethod {
  type: "bank";
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    last4: string;
    accountType: "checking" | "savings";
  };
}

export type PaymentMethodUnion =
  | CardPaymentMethod
  | PayPalPaymentMethod
  | CryptoPaymentMethod
  | BankPaymentMethod;

export interface NewCardPaymentMethod {
  type: "card";
  cardDetails: {
    brand: CardBrand;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    cardholderName: string;
    billingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  setAsDefault?: boolean;
}

export interface NewPayPalPaymentMethod {
  email: string;
  setAsDefault?: boolean;
}

export interface NewCryptoPaymentMethod {
  cryptoType: CryptoType;
  walletAddress: string;
  network: string;
  setAsDefault?: boolean;
}

export interface NewBankPaymentMethod {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings";
  setAsDefault?: boolean;
}

export type NewPaymentMethodUnion =
  | NewCardPaymentMethod
  | NewPayPalPaymentMethod
  | NewCryptoPaymentMethod
  | NewBankPaymentMethod;
