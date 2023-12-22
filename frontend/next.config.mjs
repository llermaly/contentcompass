/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  redirects: async () => [
    {
      source: "/",
      destination: "/app",
      permanent: false,
    },
  ],
};

export default config;
