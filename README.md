# ⚔️ Chore Quest

A gamified daily habit tracker. Complete your daily quests to earn XP, level up and keep your streak alive. Everything runs in the browser: no account, backend or database.

Built with Next.js (App Router), React and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## How it works

**XP and levels**

| Difficulty | XP |
|------------|----|
| Easy       | 10 |
| Medium     | 25 |
| Hard       | 50 |

Every 100 XP is one level (0-99 XP is level 1, 100-199 is level 2, and so on). XP is never lost, whether you delete a habit, miss a day or break a streak.

**Daily reset**

Habits are unchecked at the start of each new calendar day, based on your local date. The app compares today's date with the last stored date, so it resets correctly if you close the browser and come back later, even after several days away.

**Streaks**

A day counts only if you complete all currently active habits. Completing a full day adds 1 to the streak. Missing a day resets it to 0. Deleting a habit re-checks the day against the remaining habits.

**No XP farming**

Each habit can be completed once per day. Completed habits cannot be unchecked or claimed again.

**Persistence**

All state is saved in `localStorage` under the key `chore-quest:v1`: habits, XP, streak, last active date and completion history. To reset your progress, clear that key in your browser's dev tools.

## Project structure

```
app/                 Next.js entry (layout, page, global styles)
components/          UI: Dashboard, LevelCard, HabitItem, AddHabitModal
lib/
  types.ts           Shared TypeScript types
  xp.ts              XP values and level calculation
  dates.ts           Local date helpers
  streak.ts          Daily rollover and streak rules
  state.ts           Reducer (hydrate, complete, add, delete)
  storage.ts         localStorage load/save with validation
  useQuest.ts        Hook connecting the reducer to storage
```

The XP, date, streak and storage logic is separate from the UI, which makes it easy to add features like habit editing, XP history, achievements, weekly stats, categories, themes or sound effects. Completion history is already stored for that purpose.

## Notes

- Progress is stored per browser and device. Clearing site data removes it.
- Habit names are limited to 40 characters and must be unique.
