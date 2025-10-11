const jokes = [
  {
    q: "Why did the scarecrow win an award?",
    a: "Because he was outstanding in his field!",
  },
  {
    q: "What do you call a fake noodle?",
    a: "An Impasta!",
  },
  {
    q: "Why don't scientists trust atoms?",
    a: "Because they make up everything!",
  },
  {
    q: "What do you call a lazy kangaroo?",
    a: "Pouch potato!",
  },
  {
    q: "Why did the cookie go to the doctor?",
    a: "Because it felt crummy!",
  },
  {
    q: "What has ears but cannot hear?",
    a: "A cornfield!",
  },
  {
    q: "What do you get when you cross a snowman and a vampire?",
    a: "Frostbite!",
  },
];

export function getRandomJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)];
}
