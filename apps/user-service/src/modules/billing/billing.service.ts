import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateBillingDto } from "../../../../billing-service/src/billing/dto/create-billing.dto";
import { UpdateBillingDto } from "../../../../billing-service/src/billing/dto/update-billing.dto";
import { CreateCustomerDto } from "../../../../billing-service/src/billing/dto/create-customer.dto";
import { UpdateCustomerDto } from "../../../../billing-service/src/billing/dto/update-customer.dto";
import { CreateAccountDto } from "../../../../billing-service/src/billing/dto/create-account.dto";
import { UpdateAccountDto } from "../../../../billing-service/src/billing/dto/update-account.dto";
import { CreateInvoiceDto } from "../../../../billing-service/src/billing/dto/create-invoice.dto";
import { UpdateInvoiceDto } from "../../../../billing-service/src/billing/dto/update-invoice.dto";
import { CreatePaymentMethodDto } from "../../../../billing-service/src/billing/dto/create-payment-method.dto";
import { CreateBillingCycleDto } from "../../../../billing-service/src/billing/dto/create-billing-cycle.dto";
import { UpdateBillingCycleDto } from "../../../../billing-service/src/billing/dto/update-billing-cycle.dto";
import { CreateTransactionDto } from "../../../../billing-service/src/billing/dto/create-transaction.dto";
import { UpdateTransactionDto } from "../../../../billing-service/src/billing/dto/update-transaction.dto";
import { Observable, firstValueFrom } from 'rxjs';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // `${process.env.KAFKA_BROKER}` Get the broker string from the environment variable
const brokers = broker.split(','); // This creates an array from the comma-separated string

@Injectable()
export class BillingClientService  implements OnModuleInit, OnModuleDestroy {
  
  private readonly kafka = new Kafka({
// Docker Compose file has two listeners:
// INSIDE: kafka:9093 for internal Docker networking.
// OUTSIDE: kafka:9092 for external access from your host machine.
    clientId: 'user-service',
    brokers: brokers,
    logLevel: logLevel.DEBUG, // This will give you detailed logs
    // info: logLevel.INFO,
  });

  private consumer: Consumer;

  constructor(
    @Inject('BILLING_SERVICE') private readonly client: ClientProxy // Assuming you've set up BILLING_SERVICE in your module
  ) {}

  async onModuleInit() {
    this.consumer = this.kafka.consumer({ groupId: 'user-service-consumer-group' });
    await this.consumer.connect();
  
    // Increase timeout or add more logging
    await this.consumer.subscribe({ topic: 'billing-topic', fromBeginning: true });
  
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const formatMessage: any = message.value;
        const billingData = JSON.parse(formatMessage.toString());
        await this.processBillingData(billingData);
      },
    });
  }
  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  async processBillingData(data: any) {
    // Your logic to process billing data
  }
  createBilling(createBillingDto: CreateBillingDto): Observable<any> {
    return this.client.emit('createBilling', createBillingDto);
  }

  findAllBilling(): Observable<any> {
    return this.client.emit('findAllBilling', {});
  }

  findOneBilling(id: string): Observable<any> {
    return this.client.emit('findOneBilling', id);
  }

  updateBilling(updateBillingDto: UpdateBillingDto): Observable<any> {
    return this.client.emit('updateBilling', updateBillingDto);
  }

  removeBilling(id: string): Observable<any> {
    return this.client.emit('removeBilling', id);
  }

  // Customer methods
  createCustomer(createCustomerDto: CreateCustomerDto): Observable<any> {
    return this.client.emit('createCustomer', createCustomerDto);
  }

  updateCustomer(updateCustomerDto: UpdateCustomerDto): Observable<any> {
    return this.client.emit('updateCustomer', updateCustomerDto);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.client.emit('deleteCustomer', id);
  }

  // Account methods
  createAccount(createAccountDto: CreateAccountDto): Observable<any> {
    return this.client.emit('createAccount', createAccountDto);
  }

  updateAccount(updateAccountDto: UpdateAccountDto): Observable<any> {
    return this.client.emit('updateAccount', updateAccountDto);
  }

  deleteAccount(id: number): Observable<any> {
    return this.client.emit('deleteAccount', id);
  }

  // Invoice methods
  createInvoice(createInvoiceDto: CreateInvoiceDto): Observable<any> {
    return this.client.emit('createInvoice', createInvoiceDto);
  }

  updateInvoice(updateInvoiceDto: UpdateInvoiceDto): Observable<any> {
    return this.client.emit('updateInvoice', updateInvoiceDto);
  }

  deleteInvoice(id: number): Observable<any> {
    return this.client.emit('deleteInvoice', id);
  }

  // Payment Methods
  createPaymentMethod(paymentMethodDto: CreatePaymentMethodDto): Observable<any> {
    return this.client.emit('createPaymentMethod', paymentMethodDto);
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.client.emit('deletePaymentMethod', id);
  }

  // Additional methods for Billing Cycles, Transactions, etc. can be added in a similar manner.
  // Billing Cycle methods
createBillingCycle(createBillingCycleDto: CreateBillingCycleDto): Observable<any> {
    return this.client.emit('createBillingCycle', createBillingCycleDto);
  }
  
  updateBillingCycle(updateBillingCycleDto: UpdateBillingCycleDto): Observable<any> {
    return this.client.emit('updateBillingCycle', updateBillingCycleDto);
  }
  
  deleteBillingCycle(id: number): Observable<any> {
    return this.client.emit('deleteBillingCycle', id);
  }
  
  findAllBillingCycles(): Observable<any> {
    return this.client.emit('findAllBillingCycles', {});
  }
  
  findOneBillingCycle(id: number): Observable<any> {
    return this.client.emit('findOneBillingCycle', id);
  }

  // Transaction methods
createTransaction(createTransactionDto: CreateTransactionDto): Observable<any> {
    return this.client.emit('createTransaction', createTransactionDto);
  }
  
  updateTransaction(updateTransactionDto: UpdateTransactionDto): Observable<any> {
    return this.client.emit('updateTransaction', updateTransactionDto);
  }
  
  deleteTransaction(id: number): Observable<any> {
    return this.client.emit('deleteTransaction', id);
  }
  
  findAllTransactions(): Observable<any> {
    return this.client.emit('findAllTransactions', {});
  }
  
  findOneTransaction(id: number): Observable<any> {
    return this.client.emit('findOneTransaction', id);
  }
}
