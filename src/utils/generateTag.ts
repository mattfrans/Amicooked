const adjectives = ['Based', 'Comfy', 'Doomed', 'Elite', 'Fren', 'Gigachad', 'Happy', 'Iron'];
const nouns = ['Anon', 'Bear', 'Chad', 'Degen', 'Expert', 'Frog', 'Guru', 'Hero'];

export const generateRandomTag = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999);
  return `${adjective}${noun}${number}`;
};