import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common"; // https server
import { MessagePattern, Payload } from "@nestjs/microservices";
import { BillingService } from "./billing.service";
import { CreateBillingDto } from "./dto/create-billing.dto";
import { UpdateBillingDto } from "./dto/update-billing.dto";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { CreateBillingCycleDto } from "./dto/create-billing-cycle.dto";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
// import { API_GATEWAY_PATTERNS } from '../../../../libs/contracts/src/contracts.patterns'

// MICROSERVICES

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @MessagePattern("createBilling")
  create(@Payload() createBillingDto: CreateBillingDto) {
    return this.billingService.create(createBillingDto);
  }

  @MessagePattern("findAllBilling")
  findAll() {
    return this.billingService.findAll();
  }

  @MessagePattern("findOneBilling")
  findOne(@Payload() id: string) {
    return this.billingService.findOne(id);
  }

  @MessagePattern("updateBilling")
  update(@Payload() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(updateBillingDto["id"], updateBillingDto);
    // return this.billingService.update(updateBillingDto["id"], updateBillingDto);
  }

  @MessagePattern("removeBilling")
  remove(@Payload() id: string) {
    return this.billingService.remove(id);
  }

  // Customer Message Patterns
  @MessagePattern("getAllCustomers")
  getAllCustomers() {
    return this.billingService.getAllCustomers();
  }

  @MessagePattern("getCustomerById")
  getCustomerById(@Payload() id: string) {
    return this.billingService.getCustomerById(id);
  }

  @MessagePattern("createCustomer")
  createCustomer(@Payload() customerData: CreateCustomerDto) {
    return this.billingService.createCustomer(customerData);
  }

  @MessagePattern("updateCustomer")
  updateCustomer(@Payload() updateCustomerDto: UpdateCustomerDto) {
    return this.billingService.updateCustomer(
      updateCustomerDto.id,
      updateCustomerDto
    );
  }

  @MessagePattern("deleteCustomer")
  deleteCustomer(@Payload() id: number) {
    return this.billingService.deleteCustomer(id);
  }

  // Account Message Patterns
  @MessagePattern("getAllAccounts")
  getAllAccounts() {
    return this.billingService.getAllAccounts();
  }

  @MessagePattern("getAccountById")
  getAccountById(@Payload() id: string) {
    return this.billingService.getAccountById(id);
  }

  @MessagePattern("createAccount")
  createAccount(@Payload() accountData: CreateAccountDto) {
    return this.billingService.createAccount(accountData);
  }

  @MessagePattern("updateAccount")
  updateAccount(@Payload() updateAccountDto: UpdateAccountDto) {
    return this.billingService.updateAccount(
      updateAccountDto.id,
      updateAccountDto
    );
  }

  @MessagePattern("deleteAccount")
  deleteAccount(@Payload() id: string) {
    return this.billingService.deleteAccount(id);
  }

  // Invoice Message Patterns
  @MessagePattern("getAllInvoices")
  getAllInvoices() {
    return this.billingService.getAllInvoices();
  }

  @MessagePattern("getInvoiceById")
  getInvoiceById(@Payload() id: number) {
    return this.billingService.getInvoiceById(id);
  }

  @MessagePattern("createInvoice")
  createInvoice(@Payload() invoiceData: CreateInvoiceDto) {
    return this.billingService.createInvoice(invoiceData);
  }

  @MessagePattern("updateInvoice")
  updateInvoice(@Payload() updateInvoiceDto: UpdateInvoiceDto) {
    return this.billingService.updateInvoice(
      updateInvoiceDto.id,
      updateInvoiceDto
    );
  }

  @MessagePattern("deleteInvoice")
  deleteInvoice(@Payload() id: string) {
    return this.billingService.deleteInvoice(id);
  }

  // Payment Methods
  @MessagePattern("getAllPaymentMethods")
  getAllPaymentMethods() {
    return this.billingService.getAllPaymentMethods();
  }

  @MessagePattern("createPaymentMethod")
  createPaymentMethod(@Payload() paymentMethodData: CreatePaymentMethodDto) {
    return this.billingService.createPaymentMethod(paymentMethodData);
  }

  // @MessagePattern("updatePaymentMethod")
  // updatePaymentMethod(
  //   @Payload()
  //   {
  //     id,
  //     ...updateData
  //   }: {
  //     id: number;
  //     updateData: Partial<CreatePaymentMethodDto>;
  //   }
  // ) {
  //   return this.billingService.updatePaymentMethod(id, updateData);
  // }

  @MessagePattern("deletePaymentMethod")
  deletePaymentMethod(@Payload() id: string) {
    return this.billingService.deletePaymentMethod(id);
  }

  // Billing Cycles
  @MessagePattern("getAllBillingCycles")
  getAllBillingCycles() {
    return this.billingService.getAllBillingCycles();
  }

  @MessagePattern("createBillingCycle")
  createBillingCycle(@Payload() billingCycleData: CreateBillingCycleDto) {
    return this.billingService.createBillingCycle(billingCycleData);
  }

  // @MessagePattern("updateBillingCycle")
  // updateBillingCycle(
  //   @Payload()
  //   {
  //     id,
  //     ...updateData
  //   }: {
  //     id: number;
  //     updateData: Partial<CreateBillingCycleDto>;
  //   }
  // ) {
  //   return this.billingService.updateBillingCycle(id, updateData);
  // }

  @MessagePattern("deleteBillingCycle")
  deleteBillingCycle(@Payload() id: string) {
    return this.billingService.deleteBillingCycle(id);
  }

  // Transactions
  @MessagePattern("getAllTransactions")
  getAllTransactions() {
    return this.billingService.getAllTransactions();
  }

  @MessagePattern("createTransaction")
  createTransaction(@Payload() transactionData: CreateTransactionDto) {
    return this.billingService.createTransaction(transactionData);
  }

  // @MessagePattern("updateTransaction")
  // updateTransaction(
  //   @Payload() { id, ...updateData }: { id: number; updateData: Partial<CreateTransactionDto> }
  // ) {
  //   return this.billingService.updateTransaction(id, updateData);
  // }

  @MessagePattern("deleteTransaction")
  deleteTransaction(@Payload() id: string) {
    return this.billingService.deleteTransaction(id);
  }
}

// HTTPS SERVER

// @Controller('billings')
// export class BillingController {
//   constructor(private readonly billingService: BillingService) {}

//   @Post()
//   create(@Body() createBillingDto: CreateBillingDto) {
//     return this.billingService.create(createBillingDto);
//   }

//   @Get()
//   findAll() {
//     return this.billingService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.billingService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
//     return this.billingService.update(id, updateBillingDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.billingService.remove(id);
//   }
// }
