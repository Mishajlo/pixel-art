import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(2).max(32),
  password: z.string().min(8).max(128, { message: 'KO CE DA PAMTI TOLIKO?!' }),
})

export const postSchema = z.object({
  name: z.string().min(1, "Naslov mora"), 
  picture_data: z
  .array(
    z.array(z.string().min(1, "bar jedan daj").max(24, "dosta."))
  )
  .min(1, "bar jedan daj")
  .max(24, "dosta.")
  .refine((data) => {

    return data.length > 0 && data.every((row) => row.length === data.length);
  }, {
    message: "Mora NxN matrica",
  }),
});

export const patchScheme = postSchema.partial()/*z.object({
  name: z.string().min(1, "Naslov mora").optional(), 
  picture_data: z
  .array(
    z.array(z.string().min(1, "bar jedan daj").max(24, "dosta."))
  )
  .min(1, "bar jedan daj")
  .max(24, "dosta.")
  .refine((data) => {

    return data.length > 0 && data.every((row) => row.length === data.length);
  }, {
    message: "Mora NxN matrica",
  }).optional(),
});
*/