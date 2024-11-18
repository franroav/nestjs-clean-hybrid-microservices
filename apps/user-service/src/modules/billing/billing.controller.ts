import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillingClientService } from './billing.service';
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

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingClientService) {}

  // Billing Methods
  @ApiOperation({ summary: 'Create a billing entry' })
  @ApiBody({ type: CreateBillingDto })
  @ApiResponse({ status: 201, description: 'Billing created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post('billing')
  createBilling(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.createBilling(createBillingDto);
  }

  @ApiOperation({ summary: 'Retrieve all billing entries' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved billing entries' })
  @Get('billing')
  findAllBilling() {
    return this.billingService.findAllBilling();
  }

  @ApiOperation({ summary: 'Retrieve a billing entry by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Billing entry ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved billing entry' })
  @ApiResponse({ status: 404, description: 'Billing entry not found' })
  @Get('billing/:id')
  findOneBilling(@Param('id') id: string) {
    return this.billingService.findOneBilling(id);
  }

  @ApiOperation({ summary: 'Update a billing entry' })
  @ApiBody({ type: UpdateBillingDto })
  @ApiResponse({ status: 200, description: 'Billing updated successfully' })
  @ApiResponse({ status: 404, description: 'Billing entry not found' })
  @Put('billing')
  updateBilling(@Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.updateBilling(updateBillingDto);
  }

  @ApiOperation({ summary: 'Delete a billing entry by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Billing entry ID' })
  @ApiResponse({ status: 204, description: 'Billing deleted successfully' })
  @ApiResponse({ status: 404, description: 'Billing entry not found' })
  @Delete('billing/:id')
  removeBilling(@Param('id') id: string) {
    return this.billingService.removeBilling(id);
  }

  // Customer Methods
  @ApiOperation({ summary: 'Create a customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @Post('customers')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.billingService.createCustomer(createCustomerDto);
  }

  @ApiOperation({ summary: 'Update a customer' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Put('customers')
  updateCustomer(@Body() updateCustomerDto: UpdateCustomerDto) {
    return this.billingService.updateCustomer(updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Customer ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Delete('customers/:id')
  deleteCustomer(@Param('id') id: number) {
    return this.billingService.deleteCustomer(id);
  }

  // Account Methods
  @ApiOperation({ summary: 'Create an account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @Post('accounts')
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.billingService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: 'Update an account' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @Put('accounts')
  updateAccount(@Body() updateAccountDto: UpdateAccountDto) {
    return this.billingService.updateAccount(updateAccountDto);
  }

  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Account ID' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @Delete('accounts/:id')
  deleteAccount(@Param('id') id: number) {
    return this.billingService.deleteAccount(id);
  }

  // Invoice Methods
  @ApiOperation({ summary: 'Create an invoice' })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @Post('invoices')
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.billingService.createInvoice(createInvoiceDto);
  }

  @ApiOperation({ summary: 'Update an invoice' })
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @Put('invoices')
  updateInvoice(@Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.billingService.updateInvoice(updateInvoiceDto);
  }

  @ApiOperation({ summary: 'Delete an invoice by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Invoice ID' })
  @ApiResponse({ status: 204, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @Delete('invoices/:id')
  deleteInvoice(@Param('id') id: number) {
    return this.billingService.deleteInvoice(id);
  }

  // Payment Method Methods
  @ApiOperation({ summary: 'Create a payment method' })
  @ApiBody({ type: CreatePaymentMethodDto })
  @ApiResponse({ status: 201, description: 'Payment method created successfully' })
  @Post('payment-methods')
  createPaymentMethod(@Body() paymentMethodDto: CreatePaymentMethodDto) {
    return this.billingService.createPaymentMethod(paymentMethodDto);
  }

  @ApiOperation({ summary: 'Delete a payment method by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Payment method ID' })
  @ApiResponse({ status: 204, description: 'Payment method deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @Delete('payment-methods/:id')
  deletePaymentMethod(@Param('id') id: number) {
    return this.billingService.deletePaymentMethod(id);
  }

  // Billing Cycle Methods
  @ApiOperation({ summary: 'Create a billing cycle' })
  @ApiBody({ type: CreateBillingCycleDto })
  @ApiResponse({ status: 201, description: 'Billing cycle created successfully' })
  @Post('billing-cycles')
  createBillingCycle(@Body() createBillingCycleDto: CreateBillingCycleDto) {
    return this.billingService.createBillingCycle(createBillingCycleDto);
  }

  @ApiOperation({ summary: 'Update a billing cycle' })
  @ApiBody({ type: UpdateBillingCycleDto })
  @ApiResponse({ status: 200, description: 'Billing cycle updated successfully' })
  @Put('billing-cycles')
  updateBillingCycle(@Body() updateBillingCycleDto: UpdateBillingCycleDto) {
    return this.billingService.updateBillingCycle(updateBillingCycleDto);
  }

  @ApiOperation({ summary: 'Delete a billing cycle by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Billing cycle ID' })
  @ApiResponse({ status: 204, description: 'Billing cycle deleted successfully' })
  @ApiResponse({ status: 404, description: 'Billing cycle not found' })
  @Delete('billing-cycles/:id')
  deleteBillingCycle(@Param('id') id: number) {
    return this.billingService.deleteBillingCycle(id);
  }

  // Transaction Methods
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @Post('transactions')
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.billingService.createTransaction(createTransactionDto);
  }

  @ApiOperation({ summary: 'Update a transaction' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @Put('transactions')
  updateTransaction(@Body() updateTransactionDto: UpdateTransactionDto) {
    return this.billingService.updateTransaction(updateTransactionDto);
  }

  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Transaction ID' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Delete('transactions/:id')
  deleteTransaction(@Param('id') id: number) {
    return this.billingService.deleteTransaction(id);
  }
}