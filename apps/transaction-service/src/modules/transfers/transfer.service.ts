
// In this MongoDB DAO (Data Access Object) implementation, the primary objective is to manage payment transactions and their related entities, including orders, accounts, and associated metadata. Here’s an overview of the key parts of the code:

// 1. Filter Building and Aggregation
// matchFilterBuilder: This function generates a MongoDB filter object based on parameters such as status, from, to, and orderId. It’s designed to be used in the aggregation pipeline to filter data accurately based on dates and statuses.
// createTransferAggregateQuery: Builds an aggregate pipeline for the Transfer model with joins (lookups) to various collections like orders, commerces, apps, accounts, and banks. This ensures comprehensive query capabilities across collections, supporting complex business logic in MongoDB.
// 2. Data Formatting and Projection
// createAggregateQueryProject: Adds a project stage to the aggregation pipeline, specifying the fields to include in the output, such as status, creditNoteId, addedAt, and nested details about order, commerce, account, and bank.
// transferReducer: Post-processes each item in the aggregation result list, formatting fields to match the expected response format. This is necessary for displaying clean, structured data to the calling service.
// 3. Bank Transactions Retrieval
// getBankferTransactions and getBankferTransactionsCount: These functions perform queries on Transfer documents, applying filters and pagination to efficiently retrieve a set of transaction records. They use populate to bring in linked data from related collections (like Order and Account), simplifying access to related entity fields.
// 4. Direct SQL Access for Transactions and Refunds
// The methods getEpayTransactions and getEpayRefunds demonstrate SQL-based queries for fetching transactions and refund details. These are structured as promises and filter null values from results before returning to ensure a clean response.
// By using raw SQL here, the code manages cases where direct MongoDB querying may not be sufficient or necessary, possibly due to legacy systems or performance reasons.
// Key Improvements:
// Error Handling: Extend error handling by capturing more error specifics, such as database errors and formatting errors.
// Duplicate Methods: The duplicate definition of getBankferTransactions could be refactored for consistency.
// Pagination Control: Expand pagination capabilities in getBankferTransactions to enhance flexibility for larger data retrieval needs.
// This code forms a solid basis for managing a complex transaction system in a MongoDB-backed environment, enabling robust queries and easy extensions through MongoDB's aggregation framework.

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfer } from './schemas/transfer.model';
import { Order } from './schemas/order.model';
import { Account } from './schemas/account.model';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Transfer.name) private transferModel: Model<Transfer>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  private matchFilterBuilder({ status, from, to, appName, orderId }) {
    const filter = {};
    if (from && to) filter['addedAt'] = { $gte: new Date(from), $lte: new Date(to) };
    if (status) filter['status'] = { $eq: status };
    if (orderId) filter['orders.orderId'] = orderId;
    return filter;
  }

  private createTransferAggregateQuery(filters) {
    return this.transferModel.aggregate()
      .lookup({ from: 'orders', localField: 'order', foreignField: '_id', as: 'orders' })
      .lookup({ from: 'commerces', localField: 'commerce', foreignField: '_id', as: 'commerces' })
      .lookup({ from: 'apps', localField: 'orders.app', foreignField: '_id', as: 'apps' })
      .match(this.matchFilterBuilder(filters))
      .lookup({ from: 'accounts', localField: 'orders.account', foreignField: '_id', as: 'orderAccount' })
      .lookup({ from: 'banks', localField: 'orderAccount.bank', foreignField: '_id', as: 'accountBank' })
      .allowDiskUse(true);
  }

  private createAggregateQueryProject(aggregate) {
    return aggregate.project({
      status: 1,
      creditNoteId: 1,
      addedAt: 1,
      amount: 1,
      order: { $arrayElemAt: ['$orders', 0] },
      commerce: { $arrayElemAt: ['$commerces', 0] },
      orderApp: { $arrayElemAt: ['$apps', 0] },
      orderAccount: { $arrayElemAt: ['$orderAccount', 0] },
      accountBank: { $arrayElemAt: ['$accountBank', 0] },
    });
  }

  async getBankferTransactions(filter, limit = 1000, page = 1) {
    return this.transferModel
      .find(this.matchFilterBuilder(filter))
      .populate({
        path: 'order',
        model: 'Order',
        populate: { path: 'account', model: 'Account', select: '-_id' },
      })
      .sort({ addedAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countTransferByFilters(filter) {
    return this.transferModel.countDocuments(this.matchFilterBuilder(filter)).exec();
  }
}



// import { Injectable, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Transfer } from './schemas/transfer.model';
// import { Order } from './schemas/order.model';
// import { Account } from './schemas/account.model';
// import { TransferFilterDto } from './dto/transfer-filter.dto';
// import { TransferResultDto } from './dto/transfer-result.dto';

// @Injectable()
// export class TransferService {
//   private readonly logger = new Logger(TransferService.name);

//   constructor(
//     @InjectModel(Transfer.name) private transferModel: Model<Transfer>,
//     @InjectModel(Order.name) private orderModel: Model<Order>,
//     @InjectModel(Account.name) private accountModel: Model<Account>,
//   ) {}

//   private matchFilterBuilder(filters: TransferFilterDto) {
//     const filter: any = {};
//     const { status, from, to, orderId } = filters;

//     if (from && to) filter.addedAt = { $gte: new Date(from), $lte: new Date(to) };
//     else if (from) filter.addedAt = { $gte: new Date(from) };
//     else if (to) filter.addedAt = { $lte: new Date(to) };

//     if (status) filter.status = { $eq: status };
//     if (orderId) filter['orders.orderId'] = orderId;

//     return filter;
//   }

//   private createAggregateQuery(filters: TransferFilterDto) {
//     const filter = this.matchFilterBuilder(filters);

//     return this.transferModel.aggregate()
//       .lookup({ from: 'orders', localField: 'order', foreignField: '_id', as: 'orders' })
//       .lookup({ from: 'commerces', localField: 'commerce', foreignField: '_id', as: 'commerces' })
//       .lookup({ from: 'apps', localField: 'orders.app', foreignField: '_id', as: 'apps' })
//       .match(filter)
//       .lookup({ from: 'accounts', localField: 'orders.account', foreignField: '_id', as: 'orderAccount' })
//       .lookup({ from: 'banks', localField: 'orderAccount.bank', foreignField: '_id', as: 'accountBank' })
//       .allowDiskUse(true);
//   }

//   private projectAggregateQuery(aggregate: any) {
//     return aggregate.project({
//       status: 1,
//       creditNoteId: 1,
//       addedAt: 1,
//       amount: 1,
//       order: { $arrayElemAt: ['$orders', 0] },
//       commerce: { $arrayElemAt: ['$commerces', 0] },
//       orderApp: { $arrayElemAt: ['$apps', 0] },
//       orderAccount: { $arrayElemAt: ['$orderAccount', 0] },
//       accountBank: { $arrayElemAt: ['$accountBank', 0] },
//     });
//   }

//   async getBankferTransactions(filters: TransferFilterDto, limit = 1000, page = 1): Promise<TransferResultDto> {
//     try {
//       const aggregate = this.createAggregateQuery(filters);
//       const result = await this.projectAggregateQuery(aggregate)
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .exec();

//       return { isResult: true, data: result };
//     } catch (error) {
//       this.logger.error(`Error fetching transactions: ${error.message}`);
//       return { isResult: false, error: error.message };
//     }
//   }
// }