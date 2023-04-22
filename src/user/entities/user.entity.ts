import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Provider } from './provider.enum';


@Entity()
export class User {
  // 이메일, 패스워드, 휴대폰번호
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public phone: number;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL
  })
  public provider: Provider

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
