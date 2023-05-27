import { Combobox } from '@headlessui/react';
import { isEmpty, map } from 'lodash';
import type { ChangeEvent, JSX } from 'react';
import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { ROOT_URL } from '../../../../../util/constants';
import type {
  LearningMaterialIndex,
  LearningMaterialSearchResponse,
} from '../../../../api/material-search/types';
import type { FormInputs } from './create-modal';

export type SearchResponse = {
  instructors: string[];
  name: string;
  publisherName: string;
};

type CreateSearchBoxProperties = {
  setValue: UseFormSetValue<FormInputs>;
};

export function CreateSearchBox({
  setValue,
}: CreateSearchBoxProperties): JSX.Element {
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<SearchResponse>();
  const [searchResults, setSearchResults] = useState<LearningMaterialIndex[]>(
    [],
  );

  const emptySearch = (): void => {
    setSearchResults([]);
  };

  const handleSearchMaterials = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (isEmpty(event.target.value)) {
      emptySearch();
      return;
    }

    const response = await fetch(
      `${ROOT_URL}/api/material-search?search=${event.target.value}`,
      {
        credentials: 'same-origin',
      },
    );

    const data = (await response.json()) as LearningMaterialSearchResponse;
    setSearchResults(data.hits);
  };

  const handleChange = (data: SearchResponse): void => {
    if (isEmpty(data)) {
      emptySearch();
    } else {
      setValue('name', data.name);
      setValue('publisherName', data.publisherName);
      setValue('instructors', data.instructors.join(','));
      setSelectedSearchResult(data);
    }
  };

  return (
    <Combobox as="div" value={selectedSearchResult} onChange={handleChange}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        Search
      </Combobox.Label>
      <Combobox.Input
        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Search for existing material"
        onChange={handleSearchMaterials}
      />
      {!isEmpty(searchResults) && (
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
          {map(searchResults, item => {
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
                  );
                }}
              >
                {({ selected }): JSX.Element => {
                  return (
                    <>
                      <p
                        className={twMerge(
                          'block truncate',
                          selected && 'font-bold',
                        )}
                      >
                        {item.name} -- {item.publisherName}
                      </p>
                      <p>{new Intl.ListFormat().format(item.instructors)}</p>
                    </>
                  );
                }}
              </Combobox.Option>
            );
          })}
        </Combobox.Options>
      )}
    </Combobox>
  );
}
