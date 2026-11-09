# Katan Aleinu

**A personalized activity recommendation app for parents of children from birth to age 6. It turns everyday routine moments into opportunities for development.**

![App demo](docs/demo.gif)

## About the project

I built this project as a student during a hackathon. Our team set out to solve one challenge: young parents often don't know what to do with their child during everyday routine moments. How can we help them turn daily life into a chance for their child to grow, without adding more pressure to their day?

## The solution

Katan Aleinu gets to know each child through a personal profile: age, interests, challenges and daily routine. Based on this profile, the app suggests short, simple activities grounded in research (AAP, CDC, WHO). Each activity takes only a few minutes and needs no special equipment.

Parents get reminders at times they choose. They can also take a photo of the current situation and get an activity idea that fits that exact moment. After an activity, the parent reports and rates the experience, and earns points, daily streaks and badges that motivate them to keep going.

## Main features

- **Child profile and onboarding**: age, daily routine, the child's and the parent's interests, a main challenge, and priority areas (language, motor skills, social, emotional, thinking, creativity).
- **Ideas by place and moment**: at home (diaper change, eating, dressing, bath time, story time, play), in the kitchen, at the park, at the supermarket and in the car.
- **Quick photo**: take a photo of the place or an object, and AI analyzes it and suggests a matching activity.
- **Tips for every activity**: how to start, what to say and how to take it further.
- **Reports and feedback**: a rating, the child's engagement and the parent's experience.
- **Gamification**: points, daily streaks and badges (🌱 First Step, 🔥 3-Day Streak, 🏆 25 Activities and more).
- **Several children, two parents**: switch between children, and both parents share the same child profile.
- **Progress screen** with a summary of activities and badges.
- A Hebrew, right-to-left interface designed for mobile.

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | React, Vite, React Router, TanStack Query |
| Styling | Tailwind CSS, shadcn/ui (Radix UI), lucide-react |
| Backend | [Base44](https://base44.com): entities, row-level security, user authentication |
| AI | Server functions (Deno) that call an LLM through Base44 |

## Project structure

```
base44/
  entities/       # Data model: Child, Activity, Report, User
  functions/      # Server functions
    suggestActivity/     # Suggests an activity, including photo analysis
    generateActivities/  # Generates a set of activities from the child's profile
    placeIdeas/          # Ideas by place and routine moment
    activityTips/        # Tips for the parent for each activity
src/
  pages/          # Landing, Home, Onboarding, Progress, Login, Register...
  components/     # App components (onboarding/, ui/ and more)
  hooks/          # useChildren, useReminders
  lib/            # gamification.js (points, streaks, badges), places.js (places and moments)
docs/
  demo.gif        # Demo video
```

## Running locally

Requirements: [Node.js](https://nodejs.org), [Deno](https://docs.deno.com/runtime/getting_started/installation/) and the Base44 CLI.

```bash
npm install
npm install -g base44@latest
base44 login   # once per machine
base44 link    # once per clone
base44 dev     # local backend + frontend
```

Then open the URL that `base44 dev` prints (usually `http://localhost:5173`).

Notes:
- `base44 link` creates the file `base44/.app.jsonc`, which is not committed to git. Run it after every new clone.
- Don't run `npm run dev` on its own. Without `base44 dev` there is no backend, and every API call fails.
- With `base44 dev`, data is kept in memory and is erased on every restart. To work against the hosted backend, use `base44 dev --remote`. Note that in this mode all writes go to the production data.

More information: [Base44 local development docs](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)

## Disclaimer

The app only suggests activity ideas. It does not replace professional advice or diagnosis.
