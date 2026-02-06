/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.jsx",
    "./MidiPianoRoll.jsx",
    "./WaveformVisualizer.jsx",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#00aaff",
        "accent-green": "#39ff14",
        "dark-panel": "#121212",
      },
      fontFamily: {
        "display": ["'Space Grotesk'", "sans-serif"]
      }
    },
  },
  plugins: [],
}
