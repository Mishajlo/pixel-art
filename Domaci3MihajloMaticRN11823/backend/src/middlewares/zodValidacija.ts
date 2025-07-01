import { ZodError, ZodSchema } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { APIErrorCommon, ErrorCode } from '../errorCode'

export const validiranjeSchema = (schema: ZodSchema) => {
return (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body)
    next()
    } catch (greska) {
  if(greska instanceof ZodError){
    if (req.body.picture_data && !Array.isArray(req.body.picture_data)) {
      res.status(400).json({
          failed: true,
          code: "BAD_PICTURE_DATA",
      });
          return
          }
          else{
       res.status(400).json({
          failed: true,
          code: "INVALID_DATA",
          extra: greska.issues,
        });
        return
        }
      }
      next(greska)
    }
  }
}
