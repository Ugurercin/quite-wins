import { NOTIFICATION_MESSAGES, GRACE_NOTIFICATION_MESSAGES } from '@/notifications/notifications'

export const COPY = {
  onboarding: {
    hero: {
      kicker: '✨ Tiny wins, real momentum',
      appName: 'Quiet Wins',
      title: 'Grow a little world from the things you did right.',
      subtitle: 'Log small moments, keep your streak alive, and watch your garden slowly come to life.',
      footnote: 'Takes less than a minute',
    },
    features: {
      wins: 'Plant your wins',
      streaks: 'Build streaks',
      grow: 'See it grow',
    },
    stepTitles: {
      step2: 'A small reminder.',
      step3: 'Why Quiet Wins stays small.',
      step4: 'When should we remind you?',
      step5: "What's one thing you did today?",
      step6: 'Here it is.',
    },
    step2: {
      badge: 'You are doing more than you think',
      title: 'A lot of good things in your day go unnoticed.',
      body1: 'The walk you took. The task you finished. The message you finally answered. The moment you kept going even when you were tired.',
      body2: 'It may not always feel like it adds up, but it does. You are doing fine. Keep showing up, and let the small things count.',
      quote: 'Tiny wins still move your life forward.',
      cta: "Let's keep going",
    },
    step3: {
      badge: 'Gentle by design',
      title: "You don't need to log everything.",
      body: "Quiet Wins works best in small doses. A soft daily limit helps your wins stay meaningful instead of turning into another task list.",
      point1Title: 'Keeps it intentional',
      point1Sub: 'A few wins a day matters more than dumping everything at once.',
      point2Title: 'Gives tomorrow a place',
      point2Sub: 'Your garden grows over time, not all in one sitting.',
      quote: 'A few small wins a day is plenty.',
      cta: 'That makes sense',
    },
    step4: {
      lead: 'Just one gentle nudge a day.',
      options: {
        morning: { label: 'Morning', sub: 'Start the day gently · 9:00 AM' },
        evening: { label: 'Evening', sub: 'Reflect before bed · 8:00 PM' },
        custom: { label: 'Custom time', sub: 'Choose what fits your rhythm' },
        skip: { label: 'Skip for now', sub: 'You can always enable it later' },
      },
      cta: 'Continue',
    },
    step5: {
      lead: 'Anything counts. Big or small. This is your first planted win.',
      emojiPickerTitle: 'Pick the vibe',
      emojiPickerSub: 'Choose an emoji that matches your win.',
      inputLabel: 'Your first win',
      placeholder: 'e.g. Went for a walk, answered that hard message, finished a small task...',
      cta: 'Plant this win',
    },
    step6: {
      title: 'Your garden has started.',
      sub: 'Every small thing you log adds a little more life to this space.',
      cta: 'Go to my garden',
    },
    cta: {
      start: 'Start my garden',
    },
  },

  garden: {
    slogan: 'the small stuff adds up',
    cta: {
      plant: 'Plant a win',
      plantAnother: 'Plant another win',
      oneLeft: 'One more slot left',
      limitReached: "That's 3 for today 🌿",
    },
    streakReset: 'You missed a day. Your streak resets, but your garden stays.',
  },

  history: {
    subtitle: 'Every small win you logged',
    emptyTitle: 'No wins yet',
    emptyBody: 'Your logged wins will appear here.\nGo plant your first one.',
    streakReset: 'You missed a day. It happens. Your streak resets but your garden stays.',
  },

  archive: {
    intro: 'Each season is a chapter. Tap one to see what you grew.',
    emptyText: 'No completed seasons yet.\nKeep growing.',
  },

  snapshot: {
    hint: 'A snapshot of everything you grew.',
  },

  settings: {
    sections: {
      sound: 'SOUND',
      preferences: 'PREFERENCES',
      connect: 'CONNECT',
    },
    rows: {
      music: 'Music',
      sfx: 'Sound effects',
      notifTime: 'Notification time',
      theme: 'Theme',
      feedback: 'Send feedback',
      newsletter: 'Join the newsletter',
      social: 'Follow on X',
      review: 'Leave a review',
    },
  },

  notifications: {
    messages: NOTIFICATION_MESSAGES,
    graceMessages: GRACE_NOTIFICATION_MESSAGES,
  },
} as const
