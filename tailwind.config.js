/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        213555: "#213555",
        D8C4B6: "#D8C4B6",
        F5EFE7: "#F5EFE7",
        "4F709C": "#4F709C",
        B0578D: "#B0578D",
      },
      textColor: {
        213555: "#213555",
        D8C4B6: "#D8C4B6",
        FFFADD: "#FFFADD",
        "4F709C": "#4F709C",
        B0578D: "#B0578D",
      },
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
  },
  plugins: [],
};
