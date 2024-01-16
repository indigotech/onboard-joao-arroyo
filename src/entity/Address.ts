import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Address {
  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  streetNumber: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;
}
