/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EAEDF7", // Light background
          100: "#E0E6F5", // Component background
          500: "#27187E", // Primary blue
          700: "#74C5B5",
          600: "#F1F1FA",
        },
        secondary: {
          500: "#F09731", // Orange highlight
        },
        background: {
          50: "#F1F5FA",
          100: "#E0E6F5",
          200: "#F6F8FA",
          300: "#F6F6FF",
        },

        success: {
          500: "#10B981", // Green for A rating
        },
      },
      fontFamily: {
        sans: ["Montserrat"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
