'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { addMaterialToList } from '../../../../(actions)/add-material-to-list';
import { Button } from '../../../../(components)/(elements)/button';
import { Input } from '../../../../(components)/(elements)/input';
import { Textarea } from '../../../../(components)/(elements)/textarea';
import { Modal } from '../../../../(components)/modal';

type CreateModalProperties = {
  listId: string;
  listLength: number;
  user: {
    id: string | undefined;
    profileImageUrl: string | undefined;
    username: string | null | undefined;
  } | null;
};

export function CreateModal({
  listLength,
  listId,
  user,
}: CreateModalProperties): JSX.Element {
  const router = useRouter();

  const [isOpen, toggleOpen] = useToggle(false);
  const [isLoading, toggleLoading] = useToggle(false);

  const formSchema = z
    .object({
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
      name: z.string().min(1),
      publisherName: z.string().min(1),
    })
    .transform(data => {
      return {
        ...data,
        listId,
        listLength,
      };
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      instructors: '',
      links: '',
      name: '',
      publisherName: '',
    },
    resolver: zodResolver(formSchema),
  });

  const handleCreateMaterial = async (
    data: z.output<typeof formSchema>,
  ): Promise<void> => {
    toggleLoading();
    if (user?.id) {
      await addMaterialToList(data);
    }

    router.refresh();
    toggleLoading();
    toggleOpen();
  };

  return (
    <div>
      <Button onClick={toggleOpen}>Add to List</Button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
        {/* @ts-expect-error handled by zod parse */}
        <form onSubmit={handleSubmit(handleCreateMaterial)}>
          <fieldset disabled={isLoading}>
            <Input
              error={errors.name?.message}
              label="Name"
              name="name"
              properties={{
                input: { ...register('name') },
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
