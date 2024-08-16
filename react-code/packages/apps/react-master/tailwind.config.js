/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx, ts, jsx, js}",
    "./node_modules/@zyl/components/**/*.{tsx, ts, jsx, js}"//不加这个会导致没有颜色
  ],
  theme: {
    extend: {
      colors: {
        white: "luyi(white)",
        black: "luyi(black)",
        gray: {
          50: "luyi(gray50)",
          100:"luyi(gray100)",
          200:"luyi(gray200)",
          300:"luyi(gray300)",
          400:"luyi(gray400)",
          500:"luyi(gray500)",
          700:"luyi(gray700)",
        }
      }
    },
  },
  plugins: [],
}

