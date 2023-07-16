import { Combobox } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { debounce, isEmpty, map } from 'lodash';
import type { ChangeEvent, JSX } from 'react';
import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { ROOT_URL } from '../../../../../util/constants';
import type { LearningMaterialSearchDocument } from '../../../../../util/meilisearch';
import type { LearningMaterialSearchResponse } from '../../../../api/material-search/types';
import type { FormInputs } from './create-modal';

type CreateSearchBoxProperties = {
  setValue: UseFormSetValue<FormInputs>;
};

export function CreateSearchBox({
  setValue,
}: CreateSearchBoxProperties): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>();
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<LearningMaterialSearchDocument>({
      id: '',
      instructors: '',
      links: '',
      name: '',
      publisherName: '',
    });
  const [searchResults, setSearchResults] = useState<
    LearningMaterialSearchDocument[]
  >([]);

  const emptySearch = (): void => {
    setSearchResults([]);
  };

  useQuery({
    async queryFn() {
      if (isEmpty(searchTerm)) {
        emptySearch();
        return;
      }

      const response = await fetch(
        `${ROOT_URL}/api/material-search?search=${searchTerm}`,
        {
          credentials: 'same-origin',
        },
      );

      const data = (await response.json()) as LearningMaterialSearchResponse;
      setSearchResults(data.hits);
    },
    queryKey: [searchTerm],
    suspense: true,
  });

  const handleSearchMaterials = debounce(
    async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      setSearchTerm(event.target.value);
    },
    300,
  );

  const handleChange = (data: LearningMaterialSearchDocument): void => {
    if (isEmpty(data)) {
      emptySearch();
    } else {
      setValue('name', data.name);
      setValue('publisherName', data.publisherName);
      setValue('instructors', data.instructors);
      setValue('links', data.links);
      setSelectedSearchResult(data);
    }
  };

  return (
    <Combobox as="div" value={selectedSearchResult} onChange={handleChange}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        Search
      </Combobox.Label>
      <Combobox.Input
        className="w-full rounded-md border-2 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm"
        placeholder="Search for existing material"
        onChange={handleSearchMaterials}
      />
      {!isEmpty(searchResults) && (
        <Combobox.Options className="absolute left-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border-2 bg-white py-1 shadow-lg">
          {map(searchResults, (item, index) => {
            return (
              <Combobox.Option
                key={item.id}
                value={item}
                className={({ active }): string => {
                  return twMerge(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active
                      ? 'bg-blue-600 text-white cursor-pointer'
                      : 'text-gray-900',
                    index !== searchResults.length - 1 && 'border-b-2',
                  );
                }}
              >
                <p>
                  {item.name} -- {item.publisherName}
                </p>
                <p>
                  {new Intl.ListFormat().format(item.instructors.split(','))}
                </p>
              </Combobox.Option>
            );
          })}
        </Combobox.Options>
      )}
    </Combobox>
  );
}
