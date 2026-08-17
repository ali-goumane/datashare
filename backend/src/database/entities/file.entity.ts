import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'file' })
export class FileEntity {
  @PrimaryGeneratedColumn({ name: 'file_id' }) fileId: number;
  @Column({ unique: true, length: 255 }) token: string;
  @Column({ length: 255 }) name: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) type: string | null;
  @Column({ type: 'bigint', nullable: true }) size: number | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) path: string | null;
  @Column({ name: 'access_password', type: 'varchar', length: 255, nullable: true }) accessPassword: string | null;
  @CreateDateColumn({ name: 'uploaded_at', type: 'timestamptz' }) uploadedAt: Date;
  @Column({ name: 'expire_at', type: 'timestamptz', nullable: true }) expireAt: Date | null;
  @Column({ name: 'user_id', type: 'integer', nullable: true }) userId: number | null;
  @ManyToOne(() => User, (user) => user.files, { nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'user_id' }) user: User | null;
  @ManyToMany(() => Tag, (tag) => tag.files)
  @JoinTable({ name: 'file_tag', joinColumn: { name: 'file_id', referencedColumnName: 'fileId' }, inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tagId' } })
  tags: Tag[];
}
