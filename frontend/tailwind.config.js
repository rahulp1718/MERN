/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-color": "var(--bg-color)",
        "text-color": "var(--text-color)",
        "bg-color-secondary": "var(--bg-color-secondary)",
      },
    },
  },
  plugins: [],
};
