'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../../../(components)/(elements)/button';
import { Input } from '../../../(components)/(elements)/input';

export const formSchema = z.object({
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

const defaultValues: z.input<typeof formSchema> = {
  courses: [
    {
      courseName: '',
      instructors: '',
      links: '',
      publisherName: '',
    },
  ],
  name: '',
};

export function MainForm(): JSX.Element {
  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm<z.input<typeof formSchema>>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    fields: courses,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'courses',
  });

  const onSubmit = (data: z.input<typeof formSchema>): void => {
    console.info(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        error={errors.name?.message}
        label="List Name"
        name="name"
        properties={{
          container: { className: 'w-96' },
          input: {
            placeholder: 'My Favorites',
            ...register(`name`),
          },
        }}
      />
      <div className="flex flex-wrap gap-4">
        {courses.map((course, courseIndex) => {
          return (
            <div className="my-4 w-96 border-2 p-4" key={course.id}>
              <p>Item {courseIndex + 1}</p>
              <Input
                error={errors.courses?.[courseIndex]?.courseName?.message}
                label="Course Name"
                name={`courses.${courseIndex}.courseName`}
                properties={{
                  input: {
                    placeholder: 'Web Dev 101',
                    ...register(`courses.${courseIndex}.courseName`),
                  },
                }}
              />
              <Input
                error={errors.courses?.[courseIndex]?.publisherName?.message}
                label="Publisher Name"
                name={`courses.${courseIndex}.publisherName`}
                properties={{
                  input: {
                    placeholder: 'Udemy',
                    ...register(`courses.${courseIndex}.publisherName`),
                  },
                }}
              />
              <Input
                error={errors.courses?.[courseIndex]?.links?.message}
                label="Links (comma separated)"
                name={`courses.${courseIndex}.links`}
                properties={{
                  input: {
                    placeholder: 'https://example.com, https://example2.com',
                    ...register(`courses.${courseIndex}.links`),
                  },
                }}
              />
              <Input
                error={errors.courses?.[courseIndex]?.instructors?.message}
                label="Instructors (comma separated)"
                name={`courses.${courseIndex}.instructors`}
                properties={{
                  input: {
                    placeholder: 'John Doe, Jane Smith',
                    ...register(`courses.${courseIndex}.instructors`),
                  },
                }}
              />
              <Button
                className="border-red-500 bg-red-500 px-1 py-0.5"
                onClick={(): void => {
                  remove(courseIndex);
                }}
              >
                Remove
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          type="button"
          onClick={(): void => {
            append({ ...defaultValues.courses });
          }}
        >
          Add Course
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
