import { BaseModel } from './base.model';
// eslint-disable-next-line import/no-cycle
import { SleepModel } from './sleep.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserModel extends BaseModel {
  /**
   * Telegram user id
   */
  @Column()
  tgId!: string;

  /**
   * Telegram username
   */
  @Column({ nullable: true, type: 'varchar' })
  username?: string;

  /**
   * Telegram first name
   */
  @Column({ nullable: true, type: 'varchar' })
  firstName?: string;

  /**
   * Telegram last name
   */
  @Column({ nullable: true, type: 'varchar' })
  lastName?: string;

  /**
   * Telegram language code
   */
  @Column({ nullable: true, type: 'varchar' })
  language?: string;

  /**
   * Messages sent by the user
   */
  @OneToMany(() => SleepModel, (sleep) => sleep.user)
  sleeps!: SleepModel[];
}
