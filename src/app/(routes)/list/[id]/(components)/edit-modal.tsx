'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ROOT_URL } from '../../../../../util/constants';
import { learningListTags } from '../../../../../util/tags';
import { zodFetch } from '../../../../../util/zod';
import { Button } from '../../../../(components)/(elements)/button';
import { Input } from '../../../../(components)/(elements)/input';
import { Textarea } from '../../../../(components)/(elements)/textarea';
import { Modal } from '../../../../(components)/modal';
import { queryClient } from '../../../../(components)/providers';
import { updateMaterialReturnSchema } from '../../../../api/update-material/types';

type EditModalProperties = {
  readonly listId: string;
  readonly material: {
    id: string;
    instructors: string[];
    links: string[];
    name: string;
    publisherName: string;
  };
  readonly userId?: string;
};

export function EditModal({
  material,
  userId,
  listId,
}: EditModalProperties): JSX.Element {
  const [isOpen, toggleOpen] = useToggle(false);

  const formSchema = z
    .object({
      courseName: z.string().trim().min(1),
      instructors: z
        .string()
        .min(1)
        .transform(value => {
          return value.split(',').map(string => {
            return string.trim();
          });
        }),
      links: z
        .string()
        .url()
        .transform(value => {
          return value.split(',').map(string => {
            return string.trim();
          });
        }),
      publisherName: z.string().trim().min(1),
    })
    .transform(data => {
      return {
        ...data,
        id: material.id,
      };
    });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseName: material.name,
      instructors: material.instructors.join(', '),
      links: material.links.join(', '),
      publisherName: material.publisherName,
    },
    resolver: zodResolver(formSchema),
  });

  const { isLoading, mutate } = useMutation({
    async mutationFn(data: z.input<typeof formSchema>) {
      if (userId) {
        await zodFetch(
          updateMaterialReturnSchema,
          `${ROOT_URL}/api/update-material`,
          {
            body: JSON.stringify(data),
            credentials: 'same-origin',
            method: 'POST',
          },
        );
      }

      await queryClient.invalidateQueries(learningListTags(listId));

      toggleOpen();
    },
  });

  return (
    <div>
      <Button onClick={toggleOpen}>Edit</Button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
        <form
          onSubmit={handleSubmit(data => {
            return mutate(data);
          })}
        >
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
              <Button type="button" onClick={toggleOpen}>
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
