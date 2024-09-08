import { BaseModel } from './base.model';
// eslint-disable-next-line import/no-cycle
import { UserModel } from './user.model';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum SleepType {
  GoToBed = 'go_to_bed',
  WakeUp = 'wake_up',
}

@Entity({ name: 'sleeps' })
export class SleepModel extends BaseModel {
  /**
   * User id to which the sleep belongs
   */
  @Column()
  userId!: number;

  /**
   * User to which the sleep belongs
   */
  @ManyToOne(() => UserModel, (user) => user.sleeps)
  user!: UserModel;

  /**
   * Type - wake up or go to bed
   */
  @Column({
    enum: Object.values(SleepType),
    enumName: 'sleepsTypeEnum',
    type: 'enum',
  })
  type!: SleepType;
}
