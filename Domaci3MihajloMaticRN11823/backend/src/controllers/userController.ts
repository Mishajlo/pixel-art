import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../database'
import { Request, Response } from 'express'
import { Korisnik } from '../entities/user'
import { userSchema } from '../zodScehmas'
import { generateToken } from '../middlewares/jwtutils'

const korisnikRepository = AppDataSource.getRepository(Korisnik)

export const registracija = async (req: Request, res: Response) => {
 // try {
    //const {username, password} = req.body
    const validiraniPodaci = userSchema.parse(req.body)
    const header = req.headers.authorization
    const token = req.headers.authorization?.split(' ')[1]
    const hashPass = await bcrypt.hash(validiraniPodaci.password, 10)
    const postojeciKorisnik = await korisnikRepository.findOneBy({
      username: (validiraniPodaci.username)
    })

    if(!header && postojeciKorisnik){
        res.status(409).json({
        failed: true,
        code: "DUPLICATE_USERNAME",
    });
        return
    }

    if(header){
      if(token){
        res.status(409).json({
          failed: true,
          code: "LOGGED_IN",
      });
          return
      }
    }

    const novKorisnik = korisnikRepository.create({
      username: validiraniPodaci.username,
      password: hashPass,
    })
    await korisnikRepository.save(novKorisnik)
    res.status(201).json({failed:false,user_id:novKorisnik.user_id} )
  //} catch (greska) {
  //  res.status(500).json({ failed: true, code: "INTERNAL_ERROR" })
  //}
}

export const logovanje = async (req: Request, res: Response) => {
  try {
    const validiraniPodaci = userSchema.parse(req.body)
    const korisnik = await korisnikRepository.findOneBy({
      username: validiraniPodaci.username,
    })
    if(!korisnik){
      res.status(401).json({
        failed: true,
        code: "INCORRECT_CREDENTIALS",
    });
        return
    }

    const header = req.headers.authorization
    if(header){
      const token = req.headers.authorization?.split(' ')[1]
      if(token){
        res.status(409).json({
          failed: true,
          code: "LOGGED_IN",
      });
          return
      }
    }


    if (
      !korisnik ||
      !(await bcrypt.compare(validiraniPodaci.password, korisnik.password))
    ) {
      res.status(401).json({
        failed: true,
        code: "INCORRECT_CREDENTIALS",
    });
        return
    }
    //const token = generateToken(korisnik.user_id)
    const token = jwt.sign({ user_id: korisnik.user_id, username: korisnik.username }, "secret", {
      expiresIn: "1h",
    });
    /*const token = jwt.sign(
      { id: korisnik.user_id, username: korisnik.username },
      'secret',
    )*/
    res.status(200).json({failed:false, token:token, user_id:korisnik.user_id, username:korisnik.username})
  } catch (greska) {
    res.status(400).json({ error: greska.message })
  }
}
