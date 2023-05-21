'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../../../../(components)/(elements)/button';
import { Input } from '../../../../(components)/(elements)/input';
import { Textarea } from '../../../../(components)/(elements)/textarea';
import { Modal } from '../../../../(components)/modal';

type CreateModalProperties = {
  listId: string;
  user: {
    id: string | undefined;
    profileImageUrl: string | undefined;
    username: string | null | undefined;
  } | null;
};

export function CreateModal({
  listId,
  user,
}: CreateModalProperties): JSX.Element {
  const [isOpen, toggleOpen] = useToggle(false);
  const [isLoading, toggleLoading] = useToggle(false);

  const formSchema = z
    .object({
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
    })
    .transform(data => {
      return {
        ...data,
        listId,
        user: {
          clerkId: user?.id,
          profileImage: user?.profileImageUrl,
          username: user?.username,
        },
      };
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseName: '',
      instructors: '',
      links: '',
      publisherName: '',
    },
    resolver: zodResolver(formSchema),
  });

  const handleCreateMaterial = async (
    data: z.output<typeof formSchema>,
  ): Promise<void> => {
    if (user?.id) {
      // eslint-disable-next-line no-console
      console.log(data);
    }
  };

  return (
    <div>
      <Button onClick={toggleOpen}>Add to List</Button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
        {/* @ts-expect-error handled by zod parse */}
        <form onSubmit={handleSubmit(handleCreateMaterial)}>
          <fieldset disabled={isLoading}>
            <Input
              error={errors.courseName?.message}
              label="Name"
              name="name"
              properties={{
                input: { ...register('courseName') },
              }}
            />
            <Input
              error={errors.publisherName?.message}
              label="Publisher Name"
              name="publisherName"
              properties={{
                input: { ...register('publisherName') },
              }}
            />
            <Textarea
              error={errors.links?.message}
              label="Links (comma separated)"
              name="links"
              properties={{
                input: { ...register('links') },
              }}
            />
            <Textarea
              error={errors.instructors?.message}
              label="Instructors (comma separated)"
              name="instructors"
              properties={{
                input: { ...register('instructors') },
              }}
            />
            <div className="mt-5 flex justify-end gap-4 sm:mt-4">
              <Button
                className="border-gray-500 bg-gray-500 text-blue-700"
                type="button"
                onClick={toggleOpen}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </fieldset>
        </form>
      </Modal>
    </div>
  );
}
