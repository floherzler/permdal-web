/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Use the new PostCSS plugin entrypoint
    '@tailwindcss/postcss': {},

    // (Optional, but recommended to add vendor prefixes)
    autoprefixer: {},
  },
};

export default config;
