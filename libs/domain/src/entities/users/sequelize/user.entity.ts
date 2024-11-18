// src/core/entities/user.entity.ts
export class User {
    constructor(
      public readonly id: string,
      public name: string,
      public readonly email: string,
      private readonly password: string,
    ) {}
  
    updateName(name: string) {
      if (!name || name.length < 3) {
        throw new Error('Name must be at least 3 characters long');
      }
      this.name = name;
    }
  }


  export enum ProjectStatus {
    Pending = 'pending',
    Active = 'active',
    Cancelled = 'cancelled',
    Completed = 'completed'
  } 