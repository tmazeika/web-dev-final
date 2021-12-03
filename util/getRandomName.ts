import type { BinaryLike } from 'crypto';
import crypto from 'crypto';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export function getRandomName(seed: BinaryLike): string {
  const seedHashNum = Number.parseInt(
    crypto.createHash('md5').update(seed).digest('hex').slice(0, 12),
    16,
  );
  return (
    uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '',
      style: 'capital',
      seed: seedHashNum,
    }) + String(seedHashNum % 100)
  );
}
