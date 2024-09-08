import { BaseModel } from './base.model';
// eslint-disable-next-line import/no-cycle
import { UserModel } from './user.model';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum SleepQuality {
  '😡' = 'bad',
  '🤨' = 'meh',
  '🥹' = 'good',
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
   * Wake up time
   */
  @Column({ nullable: true, type: 'timestamp' })
  wakeUpAt?: Date;

  /**
   * Go to bed time
   */
  @Column({ nullable: true, type: 'timestamp' })
  goToBedAt?: Date;

  /**
   * Quality of sleep
   */
  @Column({
    enum: Object.values(SleepQuality),
    enumName: 'sleepsQualityEnum',
    nullable: true,
    type: 'enum',
  })
  quality?: SleepQuality;
}
