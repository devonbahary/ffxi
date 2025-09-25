import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('bg_wiki_pages')
export class BgWikiPage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 2000, unique: true })
  @Index('idx_bg_wiki_pages_url')
  url!: string;

  @Column({ type: 'text' })
  html!: string;

  @Column({ type: 'timestamp', name: 'last_crawled' })
  lastCrawled!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
