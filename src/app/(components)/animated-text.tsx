'use client';
import { useAnimationInterval } from '@ethang/hooks/use-animation-interval';
import classNames from 'classnames';
import type { JSX } from 'react';
import { useState } from 'react';

import styles from './animated-text.module.css';

const words = ['Plan', 'Create', 'Share'];

export function AnimatedText(): JSX.Element {
  const [currentWord, setCurrentWord] = useState(0);

  const handleSetcurrentWord = (): void => {
    setCurrentWord(currentWord_ => {
      if (currentWord_ === 2) {
        return 0;
      }

      return currentWord_ + 1;
    });
  };

  useAnimationInterval(2000, handleSetcurrentWord);

  return (
    <h1
      className={classNames(
        'text-3xl font-semibold',
        styles['text-anim--slide'],
      )}
    >
      <span
        className={classNames(
          'relative inline-block py-[0.1em] px-0',
          styles['text-anim__wrapper'],
        )}
      >
        {words.map((word, index) => {
          return (
            <i
              key={word}
              className={classNames({
                'not-italic': true,
                [styles['text-anim__word']]: true,
                [styles['text-anim__word--in']]: currentWord === index,
              })}
            >
              {word}
            </i>
          );
        })}
      </span>{' '}
      your path to learn <span className="underline">anything</span>.
    </h1>
  );
}
