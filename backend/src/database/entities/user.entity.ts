import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' }) userId: number;
  @Column({ unique: true, length: 255 }) email: string;
  @Column({ length: 255 }) password: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
  @OneToMany(() => FileEntity, (file) => file.user) files: FileEntity[];
}
