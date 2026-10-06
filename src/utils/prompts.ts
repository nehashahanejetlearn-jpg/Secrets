export const MAGICAL_PROMPTS = [
  "What magical moment happened today that only you noticed?",
  "If today were an ancient spell, what would it be called and what power would it hold?",
  "What secret are you keeping from the world that you can whisper here?",
  "What made you smile today like a lumos spell in a dark corridor?",
  "If you could revisit one quiet moment today, which would it be and why?",
  "What invisible challenge did you vanquish today with quiet bravery?",
  "What unexpected wisdom did an encounter or silence teach you today?",
  "What dream came to you recently that feels like a forgotten prophecy?",
  "Who in your life brought a warm glow to your thoughts today?",
  "If your heart were an ancient library right now, which book would be resting open on the table?",
  "What fear did you stare down in the shadows today?",
  "What simple joy felt like ancient alchemy today?"
];

export const getPromptForDate = (dateStr: string): string => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % MAGICAL_PROMPTS.length;
  return MAGICAL_PROMPTS[index];
};
