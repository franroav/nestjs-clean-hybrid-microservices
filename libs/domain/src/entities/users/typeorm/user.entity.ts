import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { MinLength, IsNotEmpty, IsEmail } from "class-validator";

import * as bcrypt from "bcryptjs";

// src/core/entities/user.entity.ts

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  name: string;

  @Column()
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updateAt: Date;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);

    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
  // constructor(
  //   public readonly id: string,
  //   public name: string,
  //   public readonly email: string,
  // ) {}

  // updateName(name: string) {
  //   if (!name || name.length < 3) {
  //     throw new Error('Name must be at least 3 characters long');
  //   }
  //   this.name = name;
  // }
}

export enum ProjectStatus {
  Pending = "pending",
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
}
