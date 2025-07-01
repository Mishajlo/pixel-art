import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Slika } from './picture'

@Entity()
export class Korisnik {
  @PrimaryGeneratedColumn('uuid')
  user_id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @OneToMany(() => Slika, slika => slika.author, { cascade: true })
  pictures: Slika[]
}
