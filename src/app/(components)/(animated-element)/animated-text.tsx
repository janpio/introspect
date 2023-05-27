'use client';
import { useAnimationInterval } from '@ethang/hooks/use-animation-interval';
import type { JSX } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import styles from './animated-text.module.css';

export const pathWords = ['Plan', 'Create', 'Discover', 'Share'];

export function AnimatedText(): JSX.Element {
  const [currentWord, setCurrentWord] = useState(0);

  const handleSetCurrentWord = (): void => {
    setCurrentWord(currentWord_ => {
      if (currentWord_ === 3) {
        return 0;
      }

      return currentWord_ + 1;
    });
  };

  useAnimationInterval(2000, handleSetCurrentWord);

  return (
    <h1
      className={twMerge(
        'text-3xl text-white font-semibold',
        styles['text-anim--slide'],
      )}
    >
      <span
        className={twMerge(
          'relative inline-block py-[0.1em] px-0',
          styles['text-anim__wrapper'],
        )}
      >
        {pathWords.map((word, index) => {
          return (
            <i
              key={word}
              className={twMerge(
                'not-italic',
                styles['text-anim__word'],
                currentWord === index && [styles['text-anim__word--in']],
              )}
            >
              {word}
            </i>
          );
        })}
      </span>{' '}
      your path to <div className="underline">learn anything.</div>
    </h1>
  );
}
