import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from './Address';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  birthDate: string;
}
