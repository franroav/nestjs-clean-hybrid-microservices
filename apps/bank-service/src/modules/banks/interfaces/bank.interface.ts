// libs/shared/src/interfaces/bank.interface.ts
export interface BankDto {
    name: string;
    code: string;
}

export interface BankResponse {
    isResult: boolean;
    data?: any;
    error?: string;
}

