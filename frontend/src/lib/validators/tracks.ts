import * as z from 'zod';

export const createTrackSchema = z.object({
  title: z.string().trim().min(1, { message: 'Título é obrigatório' }),
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
  startAt: z.string().min(1, { message: 'Data de abertura é obrigatória' }),
  closeAt: z.string().min(1, { message: 'Data de fechamento é obrigatória' }),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }),
});
