import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Korisnik } from './user'

@Entity()
export class Slika {
  @PrimaryGeneratedColumn('uuid')
  picture_id: string

  @Column()
  name: string

  @CreateDateColumn()
  created_at: string

  @CreateDateColumn()
  updated_at: string

  @ManyToOne(() => Korisnik, korisnik => korisnik.pictures)
  author: Korisnik

  @Column('text', { array: true })
  picture_data: string[][]
}
