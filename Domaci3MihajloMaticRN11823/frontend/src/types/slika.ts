import type { Pixel } from "./pixel";

export interface Slika{
  korisnik: string
  naziv: string
  idKorisnika: string
  idSlike: string
  pikseli : Pixel[][]
}
