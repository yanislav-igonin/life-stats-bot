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
  @Column({ nullable: true })
  username?: string;

  /**
   * Telegram first name
   */
  @Column({ nullable: true })
  firstName?: string;

  /**
   * Telegram last name
   */
  @Column({ nullable: true })
  lastName?: string;

  /**
   * Telegram language code
   */
  @Column({ nullable: true })
  language?: string;

  /**
   * User UI access token
   */
  @Column({ nullable: true })
  token?: string;

  /**
   * Messages sent by the user
   */
  @OneToMany(() => SleepModel, (sleep) => sleep.user)
  sleeps!: SleepModel[];
}
