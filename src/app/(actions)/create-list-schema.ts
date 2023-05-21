import { z } from 'zod';

export const createMaterialFormSchema = z.object({
  courseName: z.string().min(1),
  instructors: z
    .string()
    .min(1)
    .transform(value => {
      return value.split(',');
    }),
  links: z
    .string()
    .url()
    .transform(value => {
      return value.split(',');
    }),
  publisherName: z.string().min(1),
});

export const createListFormSchema = z.object({
  courses: z.array(createMaterialFormSchema).min(1),
  name: z.string().min(1),
});

export const createListFormSchemaWithUser = z.object({
  courses: z
    .array(
      z.object({
        courseName: z.string().min(1),
        instructors: z.array(z.string()),
        links: z.array(z.string().url()),
        publisherName: z.string().min(1),
      }),
    )
    .min(1),
  name: z.string().min(1),
  user: z.object({
    clerkId: z.string(),
    profileImage: z.string().optional(),
    username: z.string().optional(),
  }),
});
