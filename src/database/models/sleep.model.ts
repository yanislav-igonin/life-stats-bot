import { BaseModel } from './base.model';
// eslint-disable-next-line import/no-cycle
import { UserModel } from './user.model';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'sleeps' })
export class SleepModel extends BaseModel {
  /**
   * User id to which the message belongs
   */
  @Column()
  userId!: number;

  /**
   * User to which the message belongs
   */
  @ManyToOne(() => UserModel, (user) => user.sleeps)
  user!: UserModel;
}
