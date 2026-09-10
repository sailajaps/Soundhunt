// Questions 1-5: Hidden Instrument Rounds
// Each round has an image URL and instrument hotspots (x%, y% positions)
export const instrumentRounds = [
  {
    id: 1,
    title: "The Therapy Room",
    description: "Instruments are hidden in this music therapy session. Tap where you spot them!",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80",
    psychFact: "Music therapy reduces anxiety by up to 65% — it activates the parasympathetic nervous system, slowing heart rate and lowering cortisol.",
    funFact: "A guitar can have more than 100 individual parts working together to make one note.",
    surprisingFact: "Your brain can start predicting the next beat of a song before it arrives.",
    instruments: [
      { id: "guitar", name: "Guitar", x: 18, y: 55, emoji: "🎸" },
      { id: "piano", name: "Piano Keys", x: 72, y: 40, emoji: "🎹" },
      { id: "drum", name: "Drum", x: 45, y: 70, emoji: "🥁" },
      { id: "headphones", name: "Headphones", x: 10, y: 24, emoji: "🎧" },
      { id: "bass", name: "Bass Guitar", x: 86, y: 72, emoji: "🎸" },
    ]
  },
  {
    id: 2,
    title: "Inside the Brain",
    description: "The human brain responds to music like nothing else. Find the hidden instruments!",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=900&q=80",
    psychFact: "Playing music activates every area of the brain simultaneously — more so than any other human activity. It's a full brain workout!",
    funFact: "Pianos usually have 88 keys, but a concert grand can weigh more than 1,000 pounds.",
    surprisingFact: "Musicians often have stronger connections between the left and right sides of the brain.",
    instruments: [
      { id: "violin", name: "Violin", x: 25, y: 35, emoji: "🎻" },
      { id: "trumpet", name: "Trumpet", x: 60, y: 25, emoji: "🎺" },
      { id: "flute", name: "Flute", x: 80, y: 60, emoji: "🪈" },
      { id: "cymbal", name: "Cymbal", x: 14, y: 74, emoji: "🥁" },
      { id: "music-stand", name: "Music Stand", x: 52, y: 82, emoji: "🎼" },
    ]
  },
  {
    id: 3,
    title: "The Concert Crowd",
    description: "Something is hidden in this emotional concert scene. Spot the instruments!",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
    psychFact: "Live music triggers oxytocin release — the same 'bonding hormone' released during hugging. That's why concerts feel so emotionally powerful.",
    funFact: "Audience members often clap together without planning it, creating a shared group rhythm.",
    surprisingFact: "A familiar song can help people feel connected even when they do not speak the same language.",
    instruments: [
      { id: "guitar2", name: "Guitar", x: 30, y: 60, emoji: "🎸" },
      { id: "mic", name: "Microphone", x: 55, y: 30, emoji: "🎤" },
      { id: "sax", name: "Saxophone", x: 75, y: 55, emoji: "🎷" },
      { id: "tambourine", name: "Tambourine", x: 12, y: 68, emoji: "🥁" },
      { id: "spotlight", name: "Stage Spotlight", x: 88, y: 22, emoji: "💡" },
    ]
  },
  {
    id: 4,
    title: "The Recording Studio",
    description: "Find every instrument hidden in this busy recording studio.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=85",
    psychFact: "Performing music with others helps the brain coordinate timing, attention, and social connection.",
    funFact: "A recording studio can use dozens of microphones for one live session.",
    surprisingFact: "Tiny timing differences between musicians can change the feeling of an entire song.",
    instruments: [
      { id: "studio-guitar", name: "Electric Guitar", x: 18, y: 62, emoji: "🎸" },
      { id: "studio-keys", name: "Keyboard", x: 48, y: 48, emoji: "🎹" },
      { id: "studio-mic", name: "Studio Microphone", x: 70, y: 30, emoji: "🎤" },
      { id: "studio-drums", name: "Drum Kit", x: 83, y: 68, emoji: "🥁" },
      { id: "studio-headphones", name: "Headphones", x: 8, y: 22, emoji: "🎧" },
    ]
  },
  {
    id: 5,
    title: "The Orchestra Stage",
    description: "Scan the orchestra stage and click every instrument you can find.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&q=85",
    psychFact: "Listening to an orchestra combines melody, rhythm, and timbre into one rich auditory experience.",
    funFact: "A full orchestra may include more than 80 musicians.",
    surprisingFact: "Your brain separates many instruments playing at once into distinct sound streams.",
    instruments: [
      { id: "orchestra-violin", name: "Violin", x: 20, y: 42, emoji: "🎻" },
      { id: "orchestra-cello", name: "Cello", x: 38, y: 64, emoji: "🎻" },
      { id: "orchestra-horn", name: "French Horn", x: 58, y: 38, emoji: "🎺" },
      { id: "orchestra-flute", name: "Flute", x: 76, y: 48, emoji: "🪈" },
      { id: "orchestra-percussion", name: "Percussion", x: 90, y: 70, emoji: "🥁" },
    ]
  }
]

// Round 4-6: Emoji Clue Rounds
export const emojiRounds = [
  {
    id: 4,
    emoji: "😴 🧠 🌊 ∿∿∿",
    question: "Which sound effect may help some people relax or sleep?",
    options: ["Binaural beats", "A drum solo", "A music video", "A concert crowd"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    answer: "Binaural Beats",
    acceptedAnswers: ["binaural beats", "binaural", "binaural beat"],
    hint: "A type of auditory processing...",
    psychFact: "Binaural beats work by playing slightly different frequencies in each ear. Your brain perceives a third tone — the difference between them — which can shift brainwave states from alert (beta) to relaxed (alpha) or sleepy (theta).",
    funFact: "The word binaural means 'heard by both ears.'",
    surprisingFact: "Your brain can turn two separate tones into the feeling of one pulsing sound.",
    description: "What psychological sound effect do these emojis describe?"
  },
  {
    id: 5,
    emoji: "🏃 ⚡ 🎧 💪 🔥",
    question: "Why do many people listen to music while exercising?",
    options: ["It can make exercise feel easier", "It makes shoes lighter", "It stops the timer", "It replaces warm-ups"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    answer: "Music Boosts Performance",
    acceptedAnswers: ["it can make exercise feel easier", "music boosts performance", "music improves performance", "music boosts athletic performance", "performance boost", "workout music", "music helps exercise"],
    hint: "Something athletes rely on...",
    psychFact: "Listening to music during exercise can increase endurance by up to 15%. It reduces perceived effort, synchronises movement, and floods the brain with dopamine — your body's natural performance enhancer.",
    funFact: "Many runners naturally match their steps to the beat of a song.",
    surprisingFact: "The right song can make the same workout feel easier without changing the workout itself.",
    description: "What psychological effect does this describe?"
  },
  {
    id: 6,
    emoji: "😢 🎻 🌧️ 💔 🎵",
    question: "Which musical sound is often associated with sadness?",
    options: ["A minor key", "A bright light", "A fast clap", "A microphone"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    answer: "Minor Key Sadness",
    acceptedAnswers: ["a minor key", "minor key sadness", "minor key", "sad music", "minor chords", "music makes you cry", "minor scale"],
    hint: "It's about musical structure and emotion...",
    psychFact: "Minor key music mimics the acoustic properties of a human cry — falling pitch, slower tempo, lower frequency. Your brain is wired to detect distress signals in sound, so minor chords trigger genuine emotional sadness.",
    funFact: "A minor key does not always sound sad; tempo and performance style matter too.",
    surprisingFact: "People from different cultures often recognise sadness in slow, low-pitched music.",
    description: "What psychological phenomenon is shown here?"
  }
]

export const ADMIN_PASSWORD = "soundhunt2024"
export const MAX_PLAYERS = 20
export const INSTRUMENT_POINTS = 200
export const EMOJI_POINTS = 300
export const ROUND_TIMER = 45 // seconds
export const INSTRUMENT_ROUND_TIMER = 30
export const INSTRUMENT_ROUND_COUNT = instrumentRounds.length
export const TOTAL_ROUND_COUNT = instrumentRounds.length + emojiRounds.length
