import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity({ name: 'tag' })
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tag_id' }) tagId: number;
  @Column({ name: 'tag_name', length: 255 }) tagName: string;
  @ManyToMany(() => FileEntity, (file) => file.tags) files: FileEntity[];
}
