import { User } from "@app/domain/entities/users/sequelize/user.entity";
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CircuitBreakerInterceptor } from "@app/shared/interceptors/circuit-breaker.interceptor";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs'; // Change this import

const prisma = new PrismaClient();
@Injectable()
export class UserDataAccessObject {
  private users: User[] = [];
  private readonly logger = new Logger(UserDataAccessObject.name);

  constructor(
    @Inject("MAIL_SERVICE") private clientMail: ClientProxy,
    @Inject("USER_SERVICE") private userService: ClientProxy,
    @Inject("CACHE_SERVICE") private cacheService: ClientProxy
  ) {}

  // Use the method level for finer control when different endpoints have distinct needs.
  @UseInterceptors(CircuitBreakerInterceptor) // Apply interceptor at the method level
  async save(user: User): Promise<any> {
    this.logger.log("New user creation started");
    try {
      // Create the user using Prisma
      const createdUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: this.getPassword(user),
        },
      });
      this.logger.log("User created successfully");
  
      // Emit user event
      // await this.userService.emit("new_user", JSON.stringify(createdUser)).toPromise();
      // this.logger.log("User event sent successfully");

      // // Store cache on redis event
      //  await this.storeCache(user); 
      //  this.logger.log("Cache store event processed successfully");
  
      // Send email event
      await this.sendEmail(user); 
      this.logger.log("Email event processed successfully");
      
      return "User created and events sent successfully";
    } catch (err) {
      this.handleError(err, user);
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(): Promise<any> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  private async sendEmail(user: any) {
    try {
      this.logger.log("Sending mail event");
      await this.clientMail.emit("new_mail", user).toPromise();
      this.logger.log("Mail event sent successfully");
    } catch (err: any) {
      this.logger.error("Mail service failed", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        user,
      });
      throw err; // Rethrow to be caught by the Circuit Breaker
    }
  }

  private async storeCache(user: any) {
    try {
      this.logger.log("Sending mail event");
      await this.clientMail.emit("new_cache", user).toPromise();
      this.logger.log("Mail event sent successfully");
    } catch (err: any) {
      this.logger.error("Mail service failed", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        user,
      });
      throw err; // Rethrow to be caught by the Circuit Breaker
    }
  }

  // Helper method to access the private password field
  private getPassword(user: User): string {
    // If needed, perform additional logic or validation here
    // For simplicity, we assume that the private password field can be accessed in this method
    // return (user as any).password; // Access the private field
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(user['password'], saltRounds);
    return hashedPassword
  }

  private handleError(err: any, user: User) {
    const errorTemplate: any = {};
    const errorKeys = typeof err === "object" ? Object.keys(err) : [];

    if (err.code === 'P2010') {
      this.logger.error("Transactions are not supported in this environment.");
      throw new HttpException(
        "Database transaction error: " + err.message,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
    if (errorKeys.length) {
      for (let key of errorKeys) {
        errorTemplate[key] = err[key];
      }

      this.logger.error("Error sending user event", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        user,
        ...errorTemplate,
      });

      const detailedMessage = `Error sending user event: ${errorTemplate["code"]} - ${errorTemplate["syscall"]} - ${errorTemplate["address"]}:${errorTemplate["port"]}`;
      throw new HttpException(detailedMessage, HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      this.logger.error("Error sending user event", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        user,
        ...errorTemplate,
      });

      throw new HttpException(
        "Error sending user event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}


  // async save(user: User): Promise<any> {
  //   this.logger.log("New user creation started");
  //   console.log("dao service", user);

  //   try {
  //     await prisma.$transaction(async (prisma) => {
  //       // Create the user using Prisma
  //       const createdUser = await prisma.user.create({
  //         data: {
  //           name: user.name,
  //           email: user.email,
  //           password: this.getPassword(user),
  //         },
  //       });
  //       console.log("createdUser", createdUser)
  //       this.logger.log("User created successfully");

  //       // Emit the created user event
  //       // await this.userService
  //       //   .emit("new_user", JSON.stringify(createdUser))
  //       //   .toPromise();
  //       this.logger.log("User event sent successfully");

  //       // Send email event
  //       await this.sendEmail(user); // This method also emits email events
  //       this.logger.log("Email event processed successfully");
  //     });

  //     this.logger.log("All events processed successfully");
  //     return "Events sent to queues";
  //   } catch (err: any) {
  //     this.handleError(err, user);
  //   } finally {
  //     await prisma.$disconnect(); // Ensure Prisma connection is closed
  //   }
  // }