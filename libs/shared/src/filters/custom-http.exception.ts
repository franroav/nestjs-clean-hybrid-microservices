import { HttpException } from "@nestjs/common/exceptions/http.exception";

export class CustomHttpException extends HttpException {

    private readonly errorCode: string;

    constructor(response: string | Record<string, any>, status: number, errorCode: string ) {
        super(response, status);
        this.errorCode = errorCode;
    }

    getErrorCode(): string {
        return this.errorCode;
    }
    
  }