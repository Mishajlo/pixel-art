import { AppDataSource } from '../database'
import { Korisnik } from '../entities/user'
import { Slika } from '../entities/picture'
import { Request, Response } from 'express'
import { string } from 'zod'
import { QueryBuilder } from 'typeorm'

const slikaRepository = AppDataSource.getRepository(Slika)
const korisnici = AppDataSource.getRepository(Korisnik)

export const getPictures = async (req: Request, res: Response) => {
  try {
    const {limit=10, page=1, older_first=false, author} = req.query
    
    let pretragaParse = parseInt(limit as string)
    if(pretragaParse < 1) {
      pretragaParse = 1
    }else if(pretragaParse>25){
      pretragaParse = 25
    }

    let pageParse = parseInt(page as string)
    if(pageParse < 1) pageParse = 1
  

    const builder = slikaRepository.createQueryBuilder("pic")

    if(author){
      const user = await korisnici.findOne({
        where: { user_id: author.toString() },
      });
      if (user) {
        builder.where("pic.author.user_id = user_id", {
          user_id: author,
        });
      }
    }
    
    if (older_first === "true") {
      builder.orderBy("pic.created_at", "ASC");
    } else {
      builder.orderBy("pic.created_at", "DESC");
    }
    

    builder.skip((pageParse - 1) * pretragaParse).take(pretragaParse);

    const [slike, ukupno] = await builder.leftJoinAndSelect("pic.author", "author").getManyAndCount();
    res.json({ pictures: slike, total: ukupno})
  } catch (greska) {
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
  });
  }
}

export const getPicture = async(req: Request, res: Response) => {
  try{
    const {pictureId} = req.params
    const slika = await slikaRepository.findOne({
      where : {picture_id:pictureId},
      relations : ["author"]
    })
    
    if(!slika){
        res.status(404).json({
        failed: true,
        code: "NO_SUCH_ENTITY",
    });
    return
    }
    
    const slikaDTO = (slika) => ({
      name: slika.name,
      picture_data: slika.picture_data,
      picture_id: slika.picture_id.toString(),
      author: {
        user_id: slika.author.user_id.toString(),
        username: slika.author.username,
      },
      created_at: slika.created_at.toString(),
      updated_at: slika.updated_at.toString(),
    });
    
    res.status(200).json({ failed:false, picture : slikaDTO(slika) })
    
  }catch(greska){
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
      greska: greska
  });
  }
}

export const postPicture = async (req: Request, res: Response) => {
  try {
    const { name , picture_data } = req.body

    if (!name && !picture_data && !Array.isArray(picture_data) || picture_data.length === 0) {
      res.status(400).json({
        failed: true,
        code: "BAD_PICTURE_DATA",
    });
      return
    }

    const korisnik = await korisnici.findOneBy({
      user_id: req.user.user_id,
    })
    console.log(korisnik)
    const novaSlika = slikaRepository.create({
      name: name,
      author: korisnik,
      picture_data:picture_data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    await slikaRepository.save(novaSlika)

    res.status(201).json({failed:false, picture_id:novaSlika.picture_id })
  } catch (greska) {
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
  });
  }
}

export const deletePicture = async (req: Request, res: Response) => {
  try {
    const {pictureId} = req.params

    const slika = await slikaRepository.findOne({
      where : {picture_id:pictureId},
      relations : ["author"]
    })

    if(!slika){
        res.status(404).json({
        failed: true,
        code: "NO_SUCH_ENTITY",
    });
    return
    }

    if(req.user.user_id !== slika.author.user_id){
      res.status(403).json({
        failed: true,
        code: "NOT_YOURS",
    });
    return
    }

    await slikaRepository.remove(slika)
    /*await slikaRepository.delete({
      picture_id: pictureId,
    })*/

    res.status(201).json({ failed:false })
  } catch (greska) {
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
  });
  }
}

export const updatePicture = async (req: Request, res: Response) => {
  try {

    const {pictureId} = req.params

    const { name , picture_data } = req.body

    const slika = await slikaRepository.findOne({
      where : {picture_id:pictureId},
      relations : ["author"]
    })

    if(req.user.user_id !== slika.author.user_id){
      res.status(403).json({
        failed: true,
        code: "NOT_YOURS",
    });
    return
    }

    if(!slika){
        res.status(404).json({
        failed: true,
        code: "NO_SUCH_ENTITY",
    });
    return
    }

    if (!name && !picture_data && !Array.isArray(picture_data) || picture_data.length === 0) {
      res.status(400).json({
        failed: true,
        code: "BAD_PICTURE_DATA",
    });
      return
    }
    
    await slikaRepository.update(
      {
        picture_id: pictureId,
      },
      {
        name: name,
        picture_data: picture_data,
      },
    )

    res.status(200).json({ failed:false })
  } catch (greska) {
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
  });
  }
}
