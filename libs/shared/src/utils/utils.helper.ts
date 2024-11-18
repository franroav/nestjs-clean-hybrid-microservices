import { HttpStatus, Logger } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
export class Utils {
  objectValidationSql(object: any): { isValid: any; message: any } {
    throw new Error("Method not implemented.");
  }

  static dtoValidationErrorMessage(errors: any[]): string {
    return errors
      .map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(", ")}`;
      })
      .join("; ");
  }
  // dtoValidationErrorMessage(errors: import("class-validator").ValidationError[]) {
  //   throw new Error('Method not implemented.');
  // }

  data_log(codigo: number, estado: string, respuesta: string, url: string) {
    const uuid = uuidv4();
    const body = {
      uuid: uuid,
      statusCode: codigo,
      timestamp: new Date().toDateString(),
      path: url,
      respuesta: respuesta,
      estado: estado,
    };

    if (body.statusCode > 300) {
      return Logger.log(JSON.stringify(body));
    } else {
      return Logger.error(JSON.stringify(body));
    }
  }

  async templateResponse(data: any, code: any, message: any, path: string) {
    let response: any = {};
    // const { code, message } = data;
    // const response = new ConsultaGenericaResponseDto();
    response.statusCode = code;
    response.message = message;
    response.data = data;
    response.timestamp = Date.now();
    response.path = path;
    return response;
  }

  async staticTyping() {
    // 1. Static Typing
    // Feature: Declares variable types at compile time.
    // Example:

    let age: number = 30;
    let name: string = "Alice";
  }

  async interfaces() {
    // 2. Interfaces
    // Feature: Defines a structure for objects to ensure they have certain properties.
    // Example:

    interface Person {
      name: string;
      age: number;
    }
    const user: Person = { name: "Alice", age: 30 };
  }

  async typeAliases() {
    // 3. Type Aliases
    // Feature: Creates a custom name for a specific type.
    // Example:

    type ID = string | number;
    let userId: ID = "123";
  }
  async objectEnumNames() {
    // 4. Enums
    // Feature: Declares a set of named constants.
    // Example:

    enum Status {
      Active,
      Inactive,
      Pending,
    }
    let currentStatus: Status = Status.Active;
  }

  async objectGenerics() {
    // 5. Generics
    // Feature: Allows writing functions and classes with a type that is specified when called.
    // Example:

    function identity<T>(value: T): T {
      return value;
    }
    let numberIdentity = identity<number>(10);
  }

  async unionAndIntersectionTypes() {
    // 6. Union and Intersection Types
    // Feature: Combines multiple types for flexibility.
    // Example:

    type Admin = { role: string };
    type User = { name: string };
    type AdminUser = Admin & User;

    let admin: AdminUser = { name: "Alice", role: "admin" };
  }

  async classesAndAccessModifiers() {
    // 7. Classes and Access Modifiers
    // Feature: Adds access control (public, private, protected) to classes.
    // Example:

    class Animal {
      private name: string;
      constructor(name: string) {
        this.name = name;
      }
      public getName(): string {
        return this.name;
      }
    }
    const cat = new Animal("Kitty");
  }

  async objectDecorator() {
    // 8. Decorators
    // Feature: Special annotations to modify classes, methods, or properties (experimental).
    // Example:

    function Log(target: any, key: string) {
      console.log(`${key} was called`);
    }
    class MyClass {
      @Log
      method() {
        console.log("Hello");
      }
    }
  }
  async modulesAndNameSpaces() {
    // 9. Modules and Namespaces
    // Feature: Allows grouping related code for better organization.
    // Example:
    // math.ts
    // export function add(a: number, b: number): number {
    //   return a + b;
    // }
    // // app.ts
    // import { add } from "./math";
    // console.log(add(2, 3));
  }
  async typeAssertions() {
    // 10. Type Assertions
    // Feature: Allows you to override inferred types with a specific type.
    // Example:

    let someValue: any = "Hello World";
    let strLength: number = (someValue as string).length;
  }

  async chainingAndNullishCoalescing() {
    // 11. Optional Chaining and Nullish Coalescing
    // Feature: Handles undefined or null values more gracefully.
    // Example:

    let user = { name: "Alice", address: { city: "Wonderland" } };
    let city = user.address?.city ?? "Unknown";
  }

  async utilityTypes() {
    // 12. Utility Types
    // Feature: Predefined types for common operations (like Partial, Readonly, Record).
    // Example:

    interface Task {
      title: string;
      completed: boolean;
    }
    let task: Partial<Task> = { title: "Learn TypeScript" };
  }

  async typeSctiptList() {
    // TypeScript features
  }
}





// @Injectable()
// export class CatsService {
//   constructor(public myService: MyService){}

//   @CustomDecorator()
//   foo(){}
// }

// export const CustomDecorator = (): MethodDecorator => {
//   return (
//     target: Object,
//     propertyKey: string | symbol,
//     descriptor: PropertyDescriptor
//   ) => {

//     const originalMethod = descriptor.value;

//     descriptor.value = function () {
//       const serviceInstance = this;
//       console.log(serviceInstance.myService);

//     }

//     return descriptor;
//   }
// };