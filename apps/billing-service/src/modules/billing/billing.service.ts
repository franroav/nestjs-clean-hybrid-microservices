import { Injectable, Inject, NotFoundException, Logger } from "@nestjs/common";
import { ClientKafka, EventPattern } from '@nestjs/microservices'
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Billing } from "./schemas/billing.schema";
import { CreateBillingDto } from "./dto/create-billing.dto";
import { UpdateBillingDto } from "./dto/update-billing.dto";
import { Kafka, Consumer, Producer, logLevel } from "kafkajs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./entities/customer.entity";
import { Account } from "./entities/account.entity";
import { Invoice } from "./entities/invoice.entity";
import { PaymentMethod } from "./entities/payment_method.entity";
import { BillingCycle } from "./entities/billing_cycle.entity";
import { Transaction } from "./entities/transaction.entity";
import { CreateBillingCycleDto } from "./dto/create-billing-cycle.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { ClusteringService } from '../../../../libs/infrastructure/src/cluster/cluster.service';
import { WorkerThreadsService } from '../../../../libs/infrastructure/src/worker-threads/worker-threads.service';
import { ChildProcessesService } from '../../../../libs/infrastructure/src/child-processes/child-processes.service';
import { QueuesService } from '../../../../libs/infrastructure/src/queues/queues.service';

@Injectable()
export class BillingService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private readonly logger = new Logger(BillingService.name);


  constructor(
    // private readonly producer: Producer,
    // private readonly consumer: Consumer,
    private readonly clusteringService: ClusteringService,
    private readonly workerThreadsService: WorkerThreadsService,
    private readonly childProcessesService: ChildProcessesService,
    private readonly queuesService: QueuesService,
    // @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka),
    @InjectModel("billing") private readonly billingModel: Model<Billing>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(BillingCycle)
    private readonly billingCycleRepository: Repository<BillingCycle>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>
  ) {
    // Docker Compose file has two listeners:
    // INSIDE: kafka:9093 for internal Docker networking.
    // OUTSIDE: kafka:9092 for external access from your host machine.
    
    const broker = 'kafka1:9093,kafka2:9093,kafka3:9093'; // `${process.env.KAFKA_BROKER}` Get the broker string from the environment variable
    const brokers = broker.split(','); // This creates an array from the comma-separated string
    this.kafka = new Kafka({
      clientId: "nestjs-app",
      brokers: brokers, // Add your Kafka broker here
      logLevel: logLevel.DEBUG, // This will give you detailed logs
      // info: logLevel.INFO,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "nestjs-group" });
  }

  async processBillingData(createBillingDto: CreateBillingDto) {
    // Using worker threads for CPU-intensive tasks
    await this.workerThreadsService.executeTask(createBillingDto);
  }
  

  async handleKafkaMessage(message: any) {
    // Handle Kafka message processing in a separate child process
    await this.childProcessesService.executeCommand(message);
  }

  async addTaskToQueue(taskData: any) {
    // Add tasks to queue for background processing
    await this.queuesService.addToQueue(taskData);
  }

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    const createdBilling = new this.billingModel(createBillingDto);
    return createdBilling.save();
  }

  async findAll(): Promise<Billing[]> {
    return this.billingModel.find().exec();
  }

  async findOne(id: string): Promise<Billing> {
    const billing = await this.billingModel.findById(id).exec();
    if (!billing) {
      throw new NotFoundException(`Billing record with id ${id} not found`);
    }
    return billing;
  }

  async update(
    id: string,
    updateBillingDto: UpdateBillingDto
  ): Promise<Billing> {
    const updatedBilling = await this.billingModel
      .findByIdAndUpdate(id, updateBillingDto, { new: true })
      .exec();
    if (!updatedBilling) {
      throw new NotFoundException(`Billing record with id ${id} not found`);
    }
    return updatedBilling;
  }

  async remove(id: string): Promise<void> {
    const result = await this.billingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Billing record with id ${id} not found`);
    }
  }
  async sendMessage(topic: string, message: any) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await this.producer.disconnect();
  }

  async consumeMessages(topic: string, callback: (message: any) => void) {
    this.clusteringService.runInCluster(async () => {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: true });

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) {
            this.logger.warn(`Received a null or undefined message value`);
            return;
          }

          try {
            const parsedMessage = JSON.parse(message.value.toString());
            const workerResult = await this.processInWorkerThread(parsedMessage);
            const commandResult = await this.executeChildProcessCommand();

            callback({ workerResult, commandResult });
          } catch (error: any) {
            this.logger.error(`Error processing message: ${error.message}`);
          }
        },
      });
    });
  }

  private async processInWorkerThread(data: any): Promise<any> {
    try {
      const result = await this.workerThreadsService.executeTask(data);
      this.logger.log(`Worker processed message successfully`);
      return result;
    } catch (error: any) {
      this.logger.error(`Worker thread error: ${error.message}`);
      throw error;
    }
  }

  private async executeChildProcessCommand(): Promise<string> {
    try {
      const result = await this.childProcessesService.executeCommand('externalCommand', ['--arg']);
      this.logger.log(`Child process command executed successfully`);
      return result;
    } catch (error: any) {
      this.logger.error(`Child process error: ${error.message}`);
      throw error;
    }
  }

// Customer CRUD Operations
async getAllCustomers(): Promise<Customer[]> {
  return await this.clusteringService.runInCluster(async () => {
    return this.customerRepository.find(); // Return customers directly
  });
}

async getCustomerById(id: string): Promise<Customer> {
  return await this.clusteringService.runInCluster(async () => {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer; // Return the customer
  });
}

async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
  return await this.workerThreadsService.executeTask(async () => {
    const newCustomer = this.customerRepository.create(customerData);
    return await this.customerRepository.save(newCustomer); // Return the created customer
  });
}

async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
  return await this.workerThreadsService.executeTask(async () => {
    await this.customerRepository.update(id, customerData);
    return this.getCustomerById(id); // Return updated customer
  });
}

async deleteCustomer(id: number): Promise<string> {
  return await this.childProcessesService.executeCommand('deleteCommand', [String(id)]); // Assuming 'deleteCommand' is a valid command
}

// Account CRUD Operations
async getAllAccounts(): Promise<Account[]> {
  return await this.accountRepository.find();
}

async getAccountById(id: string): Promise<Account> {
  const account = await this.accountRepository.findOne({ where: { id } });
  if (!account) {
    throw new NotFoundException(`Account with ID ${id} not found`);
  }
  return account;
}

async createAccount(accountData: Partial<Account>): Promise<Account> {
  const customer = await this.customerRepository.findOne({ where: { id: accountData.customerId } });
  if (!customer) {
    throw new NotFoundException('Customer not found for this account.');
  }

  const newAccount = this.accountRepository.create({
    ...accountData,
    customer, // direct reference to the customer object
  });

  return await this.accountRepository.save(newAccount);
}

async updateAccount(id: string, accountData: Partial<Account>): Promise<Account> {
  await this.accountRepository.update(id, accountData);
  return this.getAccountById(id);
}

async deleteAccount(id: string): Promise<void> {
  const result = await this.accountRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Account with ID ${id} not found`);
  }
}

// Invoice CRUD Operations
async getAllInvoices(): Promise<Invoice[]> {
  return await this.invoiceRepository.find();
}

async getInvoiceById(id: number): Promise<Invoice> {
  const invoice = await this.invoiceRepository.findOne({ where: { id } });
  if (!invoice) {
    throw new NotFoundException(`Invoice with ID ${id} not found`);
  }
  return invoice;
}

async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  const newInvoice = this.invoiceRepository.create(invoiceData);
  return await this.invoiceRepository.save(newInvoice);
}

async updateInvoice(id: number, invoiceData: Partial<Invoice>): Promise<Invoice> {
  await this.invoiceRepository.update(id, invoiceData);
  return this.getInvoiceById(id);
}

async deleteInvoice(id: string): Promise<void> {
  const result = await this.invoiceRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Invoice with ID ${id} not found`);
  }
}

// Payment Methods
async getAllPaymentMethods(): Promise<PaymentMethod[]> {
  return await this.paymentMethodRepository.find();
}

async createPaymentMethod(dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
  const paymentMethod = this.paymentMethodRepository.create(dto);
  return await this.paymentMethodRepository.save(paymentMethod);
}

async updatePaymentMethod(id: string, dto: Partial<PaymentMethod>): Promise<PaymentMethod> {
  await this.paymentMethodRepository.update(id, dto);
  const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id } });
  if (!paymentMethod) {
    throw new NotFoundException(`Payment method with ID ${id} not found`);
  }
  return paymentMethod;
}

async deletePaymentMethod(id: string): Promise<void> {
  const result = await this.paymentMethodRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Payment method with ID ${id} not found`);
  }
}

// Billing Cycles
async getAllBillingCycles(): Promise<BillingCycle[]> {
  return await this.billingCycleRepository.find();
}

async createBillingCycle(dto: CreateBillingCycleDto): Promise<BillingCycle> {
  const billingCycle = this.billingCycleRepository.create(dto);
  return await this.billingCycleRepository.save(billingCycle);
}

async updateBillingCycle(
  id: number,
  dto: Partial<BillingCycle>
): Promise<BillingCycle | null> {
  await this.billingCycleRepository.update(id, dto);
  const paymentMethod = this.billingCycleRepository.findOne({ where: { id } });
  if (!paymentMethod) {
    throw new NotFoundException(`Billing cycle with ID ${id} not found`);
  }
  return paymentMethod;
}

async deleteBillingCycle(id: string): Promise<void> {
  const result = await this.billingCycleRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Billing cycle with ID ${id} not found`);
  }
}

// Transactions
async getAllTransactions(): Promise<Transaction[]> {
  return await this.transactionRepository.find();
}

async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
  const transaction = this.transactionRepository.create(dto);
  return await this.transactionRepository.save(transaction);
}

async updateTransaction(
  id: number,
  dto: Partial<Transaction>
): Promise<Transaction | null> {
  const transaction = await this.transactionRepository.update(id, dto);
    if (!transaction) {
    throw new NotFoundException(`Transaction with ID ${id} not found`);
  }
  return this.transactionRepository.findOne({ where: { id } });
}

async deleteTransaction(id: string): Promise<void> {
  const result = await this.transactionRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Transaction with ID ${id} not found`);
  }
}

}

