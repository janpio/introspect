import { z } from 'zod';

export const createCourseFormSchema = z.object({
  courses: z
    .array(
      z.object({
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
      }),
    )
    .min(1),
  name: z.string().min(1),
});

export const createCourseSchemaWithUser = z.object({
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
  user: z
    .object({
      fullName: z.string().optional(),
      profileImage: z.string().optional(),
      username: z.string().optional(),
    })
    .optional(),
});
