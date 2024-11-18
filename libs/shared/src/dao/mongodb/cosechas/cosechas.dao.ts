import { Cosecha } from "@app/domain/entities/cosechas/sequelize/cosecha.entity";
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
export class CosechasDataAccessObject {
  private Cosechas: Cosecha[] = [];
  private readonly logger = new Logger(CosechasDataAccessObject.name);

  constructor(
    @Inject("MAIL_SERVICE") private clientMail: ClientProxy,
    @Inject("COSECHA_SERVICE") private Cosechaservice: ClientProxy,
    @Inject("CACHE_SERVICE") private cacheService: ClientProxy
  ) {}

  // Use the method level for finer control when different endpoints have distinct needs.
  @UseInterceptors(CircuitBreakerInterceptor) // Apply interceptor at the method level
  async save(cosecha: Cosecha): Promise<any> {
    this.logger.log("New user creation started");
    try {    
      
      const createdCosecha : any = await prisma.cosecha.create({
        data: {
          frutaId: cosecha.frutaId.toString(),
          variedadId:  cosecha.variedadeId.toString(),
          agricultorId : cosecha.agricultorId.toString(),
          campoId : cosecha.campoId.toString(),
          // fechaCosecha : fechaCosecha,
          // cantidad :  cosecha.cantidad,
        },
      });
      this.logger.log("Cosecha created successfully");
  
      // Emit user event
      // await this.Cosechaservice.emit("new_user", JSON.stringify(createdUser)).toPromise();
      this.logger.log("Cosecha event sent successfully");
  
      // Send email event
      await this.sendEmail(cosecha); 
      this.logger.log("Email event processed successfully");
      
      return "User created and events sent successfully";
    } catch (err) {
      this.handleError(err, cosecha);
    } finally {
      await prisma.$disconnect();
    }
  }

  async findById(id: string): Promise<Cosecha | null> {
    return this.Cosechas.find((cosecha) => cosecha.id === id) || null;
  }

  async findByAgricultor(agricultorId: number): Promise<Cosecha | null> {
    return this.Cosechas.find((cosecha) => cosecha.agricultorId === agricultorId) || null;
  }

  private async sendEmail(cosecha: any) {
    try {
      this.logger.log("Sending mail event");
      await this.clientMail.emit("new_mail", cosecha).toPromise();
      this.logger.log("Mail event sent successfully");
    } catch (err: any) {
      this.logger.error("Mail service failed", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        cosecha,
      });
      throw err; // Rethrow to be caught by the Circuit Breaker
    }
  }



  private handleError(err: any, cosecha: Cosecha) {
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

      this.logger.error("Error sending cosecha event", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        cosecha,
        ...errorTemplate,
      });

      const detailedMessage = `Error sending cosecha event: ${errorTemplate["code"]} - ${errorTemplate["syscall"]} - ${errorTemplate["address"]}:${errorTemplate["port"]}`;
      throw new HttpException(detailedMessage, HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      this.logger.error("Error sending cosecha event", {
        error: err["message"],
        code: err["code"],
        stack: err["stack"],
        cosecha,
        ...errorTemplate,
      });

      throw new HttpException(
        "Error sending cosecha event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
  //       // await this.Cosechaservice
  //       //   .emit("new_Cosecha", JSON.stringify(createdUser))
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
}
