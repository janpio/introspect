'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { createList } from '../../../(actions)/create-list';
import {
  createListFormSchema,
  createListFormSchemaWithUser,
} from '../../../(actions)/create-list-schema';
import { Button } from '../../../(components)/(elements)/button';
import { Input } from '../../../(components)/(elements)/input';
import { Textarea } from '../../../(components)/(elements)/textarea';

type MainFormProperties = {
  user: {
    id: string | undefined;
    profileImageUrl: string | undefined;
    username: string | null | undefined;
  } | null;
};

const defaultValues: z.input<typeof createListFormSchema> = {
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

export function MainForm({ user }: MainFormProperties): JSX.Element {
  const router = useRouter();
  const [isLoading, toggleIsLoading] = useToggle(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm<z.input<typeof createListFormSchema>>({
    defaultValues,
    resolver: zodResolver(createListFormSchema),
  });

  const {
    fields: courses,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'courses',
  });

  const handleCreateList = async (
    data: z.input<typeof createListFormSchema>,
  ): Promise<void> => {
    toggleIsLoading();
    if (user?.id) {
      const parsed = createListFormSchemaWithUser.parse({
        ...data,
        user: {
          clerkId: user.id,
          profileImage: user.profileImageUrl,
          username: user.username ?? undefined,
        },
      });
      const list = await createList(parsed);
      router.refresh();
      router.push(`/list/${list.id}`);
    }

    toggleIsLoading();
  };

  return (
    <form onSubmit={handleSubmit(handleCreateList)}>
      <fieldset disabled={isLoading}>
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
                  label=" Name"
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
                <Textarea
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
                <Textarea
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
      </fieldset>
    </form>
  );
}
