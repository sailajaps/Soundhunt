# 🎯 SoundHunt

A multiplayer music psychology game. Players scan a QR code, join on their phones, and compete across 6 rounds of hidden instruments and emoji clues — all rooted in the science of how music affects the human mind.

## Game Structure

- **Rounds 1–3 🔍** — Hidden Instrument Hunt: spot instruments hidden in images. First to tap the right spot gets 200 pts.
- **Rounds 4–6 🎵** — Emoji Song Psychology: decode emoji clues to name a music psychology phenomenon. First correct answer = 300 pts.
- **Winner Reveal 🏆** — Animated leaderboard + psychology facts recap.

## Setup (15 minutes)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/soundhunt.git
cd soundhunt
npm install
```

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial SoundHunt"
git remote add origin https://github.com/YOUR_USERNAME/soundhunt.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
2. Vercel auto-detects Vite — just click **Deploy**

### 4. Add Vercel KV (the database)

1. In your Vercel project dashboard → **Storage** tab
2. Click **Create Database** → choose **KV**
3. Name it `soundhunt-kv` → Create
4. Click **Connect to Project** — Vercel auto-adds the env variables
5. Redeploy: `git push` or click **Redeploy** in Vercel dashboard

### 5. Play!

- Your URL: `https://soundhunt.vercel.app`
- Admin password: `soundhunt2024` (change in `src/data/gameData.js`)
- Show QR code on a TV/projector — players scan and join on their phones

## Changing the Admin Password

Edit `src/views/Home.jsx` line:
```js
const ADMIN_PASSWORD = 'soundhunt2024'
```

## Adding Your Own Rounds

Edit `src/data/gameData.js`:
- `instrumentRounds` — add images and hotspot coordinates (x%, y%)
- `emojiRounds` — add emoji clues, accepted answers, and psychology facts

## Tech Stack

- **Frontend** — React + Vite + Tailwind CSS
- **Backend** — Vercel Serverless Functions
- **Database** — Vercel KV (Redis)
- **Hosting** — Vercel (free hobby plan)
- **QR Code** — qrcode.react

## Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your Vercel project (pulls env vars including KV)
vercel link
vercel env pull .env.local

# Run locally
npm run dev
```
