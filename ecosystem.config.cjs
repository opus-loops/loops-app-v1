/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      autorestart: true,
      cwd: __dirname,
      env: {
        HOST: "0.0.0.0",
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_file: ".env",
      exec_mode: "fork",
      instances: 1,
      interpreter: "node",
      max_memory_restart: "1G",
      name: "loops-app",
      node_args: "--import ./.output/server/instrument.server.mjs",
      script: ".output/server/index.mjs",
      time: true,
      watch: false,
    },
  ],
}
