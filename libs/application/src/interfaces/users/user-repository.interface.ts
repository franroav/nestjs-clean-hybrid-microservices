
// import { User } from '@app/domain/entities/users/sequelize/user.entity';
// import { Injectable } from '@nestjs/common';



// @Injectable()
// export class UserRepository {
//   private users: User[] = [];
//   private readonly logger = new Logger(UserService.name);
//   private readonly emailCircuitBreaker: CircuitBreaker<any>;

//   async save(user: User): Promise<void> {
//     this.logger.log('New user creation started');

//     // First, send user event
//     try {
//       this.logger.log('Sending user event');
//       await this.userService.emit('new_user', user).toPromise();
//       this.logger.log('User event sent successfully');
//     } catch (err: any) {
//       // console.log("error user event", typeof err)
//       // console.log("error user event", err['code'])
//       // console.log("error user event", err['[errors]'])
//       // console.log("error user event", err['errors'].length)
//       // console.log("errors ", err['errors'][0])
//       // console.log("errors ", Object.keys(err['errors'][0]))
//       // console.log("errors ", err['errors'][0]['errno'])
//       // console.log("errors ", err['errors'][0]['code'])
//       // console.log("errors ", err['errors'][0]['syscall'])
//       // console.log("errors ", err['errors'][0]['address'])
//       // console.log("errors ", err['errors'][0]['port'])
//       let errorTemplate: any = {}
//       const errorKeys = typeof err === 'object' ? Object.keys(err['errors'][0]) : []
//       // console.log("errorTemplate", errorTemplate)
//       // console.log("errors ", errorKeys)
//       // errorKeys.length > 0 ? 
//       if(errorKeys.length){
//         for (let Key of errorKeys) {
//           errorTemplate[Key] = err['errors'][0][Key]
//         }

//         this.logger.error('Error sending user event', {
//           error: err['message'],
//           code: err['code'],
//           stack: err['stack'],
//           user,
//           ...errorTemplate
//         });

//         // Throw HttpException with detailed error message
//         const detailedMessage = `Error sending user event: ${errorTemplate['code']} - ${errorTemplate['syscall']} - ${errorTemplate['address']}:${errorTemplate['port']}`;
//         throw new HttpException(detailedMessage, HttpStatus.SERVICE_UNAVAILABLE);
//       } else {
//         this.logger.error('Error sending user event', {
//           error: err['message'],
//           code: err['code'],
//           stack: err['stack'],
//           user,
//           ...errorTemplate
//         });

//         throw new HttpException('Error sending user event', HttpStatus.INTERNAL_SERVER_ERROR);

//       } 
     
//     }

//     // Use Circuit Breaker for email service
//     try {
//       await this.emailCircuitBreaker.fire(user);
//       this.logger.log('Email event processed successfully');
//     } catch (err: any) {

//       this.logger.error('Error processing email event', {
//         error: err['message'],
//         code: err['code'],
//         stack: err['stack'],
//         user
//       });
//       throw new HttpException('Error sending email event', HttpStatus.INTERNAL_SERVER_ERROR);
//     }

//     this.logger.log('All events processed successfully');
//     return 'Events sent to queues';

//     // this.users.push(user);
//   }

//   async findById(id: string): Promise<User | null> {
//     return this.users.find(user => user.id === id) || null;
//   }
// }

// @Injectable()
// export class UserRepository {
//   private users: User[] = [];

//   async save(user: User): Promise<void> {
//     this.users.push(user);
//   }

//   async findById(id: any): Promise<User | null> {
//     console.log("3° step", "3° step")
//     return this.users.find(user => user.id === id) || null;
//   }
// }

// export interface UserRepository {
//     /**
//      * Find a user by their unique ID.
//      * @param id - The ID of the user.
//      * @returns A promise that resolves to the user if found, or `null` if not.
//      */
//     findById(id: string): Promise<null>;
  
//     /**
//      * Find all users.
//      * @returns A promise that resolves to an array of users.
//      */
//     findAll(): Promise<any[]>;
  
//     /**
//      * Create a new user.
//      * @param user - The user object to create.
//      * @returns A promise that resolves to the created user.
//      */
//     create(user: any): Promise<any>;
  
//     /**
//      * Update an existing user by their ID.
//      * @param id - The ID of the user to update.
//      * @param user - The updated user data.
//      * @returns A promise that resolves to the updated user, or `null` if not found.
//      */
//     update(id: string, user: Partial<any>): Promise<null>;
  
//     /**
//      * Delete a user by their ID.
//      * @param id - The ID of the user to delete.
//      * @returns A promise that resolves to `true` if deletion was successful, or `false` if not.
//      */
//     delete(id: string): Promise<boolean>;
//   }
  

//   export interface UserRepository {
//     findById(id: string): Promise<User | null>;
//     findAll(): Promise<User[]>;
//     create(user: User): Promise<User>;
//     update(id: string, user: Partial<User>): Promise<User | null>;
//     delete(id: string): Promise<boolean>;
//   }