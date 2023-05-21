'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  createMaterialFormSchema,
  createMaterialFormSchemaWithUser,
} from '../../../../(actions)/create-list-schema';
import { updateMaterial } from '../../../../(actions)/update-material';
import { Button } from '../../../../(components)/(elements)/button';
import { Input } from '../../../../(components)/(elements)/input';
import { Textarea } from '../../../../(components)/(elements)/textarea';

type EditModalProperties = {
  material: {
    id: string;
    instructors: string[];
    links: string[];
    name: string;
    publisherName: string;
  };
  user: {
    id: string | undefined;
    profileImageUrl: string | undefined;
    username: string | null | undefined;
  } | null;
};

export function EditModal({
  material,
  user,
}: EditModalProperties): JSX.Element {
  const router = useRouter();
  const [isOpen, toggleOpen] = useToggle(false);
  const [isLoading, toggleLoading] = useToggle(false);

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
    resolver: zodResolver(createMaterialFormSchema),
  });

  const handleUpdate = async (
    data: z.input<typeof createMaterialFormSchema>,
  ): Promise<void> => {
    toggleLoading();
    if (user?.id) {
      const parsed = createMaterialFormSchemaWithUser.parse({
        ...data,
        id: material.id,
        user: {
          clerkId: user.id,
          profileImage: user.profileImageUrl,
          username: user.username ?? undefined,
        },
      });
      await updateMaterial(parsed);
    }

    toggleLoading();
    router.refresh();
    toggleOpen();
  };

  return (
    <div>
      <Button onClick={toggleOpen}>Edit</Button>
      <Transition.Root as={Fragment} show={isOpen}>
        <Dialog as="div" className="relative z-10" onClose={toggleOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <form onSubmit={handleSubmit(handleUpdate)}>
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
