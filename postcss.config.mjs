const config = {
  plugins: ["@tailwindcss/postcss"],
  theme:{
    extend: {
      animation: {
        spinner:'spin 1.2s linear infinite'
      }
    }
  }
};

export default config;