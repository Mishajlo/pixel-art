import { DataSource } from "typeorm";
import { Korisnik } from "./entities/user";
import { Slika } from "./entities/picture";

export const AppDataSource = new DataSource({
    type: "postgres", // Koristimo PostgreSQL kao bazu podataka
    host: "db", // "db" je ime servisa u docker-compose fajlu
    port: 5432, // Port na kojem PostgreSQL sluša
    username: "postgres", // Korisničko ime za bazu podataka
    password: "postgres", // Lozinka za bazu podataka
    database: "chatapp", // Ime baze podataka
    synchronize: true, // Automatska sinhronizacija entiteta (ne koristiti u produkciji)
    entities: [Korisnik, Slika], // Registrujemo entitete
  });
  