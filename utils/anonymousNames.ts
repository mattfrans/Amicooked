// List of adjectives and nouns for generating anonymous names
const adjectives = [
  'Anonymous', 'Mysterious', 'Silent', 'Hidden', 'Secret', 'Shadow', 'Phantom',
  'Ghost', 'Mystic', 'Unknown', 'Nameless', 'Void', 'Ethereal', 'Wandering',
  'Lost', 'Forgotten', 'Cryptic', 'Enigmatic', 'Veiled', 'Shrouded'
];

const nouns = [
  'User', 'Anon', 'Entity', 'Being', 'Presence', 'Spirit', 'Wanderer',
  'Soul', 'Specter', 'Shadow', 'Ghost', 'Phantom', 'Figure', 'Form',
  'Stranger', 'Observer', 'Visitor', 'Wraith', 'Shade', 'Silhouette'
];

// Generate a random number between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random anonymous name
export const generateAnonymousName = (): string => {
  const useAdjective = Math.random() > 0.3; // 70% chance to use an adjective
  const randomId = getRandomInt(1000, 9999);
  
  if (useAdjective) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}#${randomId}`;
  } else {
    // Sometimes just return "Anonymous" with a number, like classic 4chan
    return `Anonymous#${randomId}`;
  }
};

// Generate a consistent anonymous name based on a seed (like user ID)
export const generateConsistentAnonymousName = (seed: string): string => {
  // Use a simple hash function to generate a number from the seed
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  
  const positiveHash = Math.abs(hash);
  const adjectiveIndex = positiveHash % adjectives.length;
  const nounIndex = (positiveHash >> 8) % nouns.length;
  const randomId = (positiveHash % 9000) + 1000;

  // 30% chance to just be "Anonymous" like in 4chan
  if (positiveHash % 100 < 30) {
    return `Anonymous#${randomId}`;
  }

  return `${adjectives[adjectiveIndex]}${nouns[nounIndex]}#${randomId}`;
};
