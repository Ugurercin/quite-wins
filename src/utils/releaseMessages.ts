export const RELEASE_MESSAGES = [
  'Even gardens need pruning. Let it go. 🍂',
  "The soil remembers, even when you let go.",
  'Roots grow deeper when you release what no longer serves.',
  'Every leaf that falls makes room for new growth.',
  "It happened. It counted. That's enough.",
  'Something better replaced it. Release this win.',
  'You logged it. You lived it. Now let it go.',
]

let lastIndex = -1

export const pickReleaseMessage = (): string => {
  let idx: number
  do {
    idx = Math.floor(Math.random() * RELEASE_MESSAGES.length)
  } while (idx === lastIndex)
  lastIndex = idx
  return RELEASE_MESSAGES[idx]
}
