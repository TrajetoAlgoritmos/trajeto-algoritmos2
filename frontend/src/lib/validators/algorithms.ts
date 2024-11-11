import * as z from 'zod';

export const createAlgorithmSchema = z.object({
  title: z.string().trim().min(1, { message: 'Título é obrigatório' }),
  tag: z.string().trim().min(1, { message: 'Tag é obrigatória' }),
  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .trim()
    .refine(
      (value) =>
        ![
          '<p><br></p>',
          '<h1><br></h1>',
          '<h2><br></h2>',
          '<h3><br></h3>',
        ].includes(value),
      {
        message: 'Descrição é obrigatória',
      }
    ),
});

export const createAlgorithmTestSchema = z.object({
  input: z.string(),
  output: z.string().trim().min(1, { message: 'Outpur é obrigatório' }),
});
