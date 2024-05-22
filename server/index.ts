import app from "./app";

Bun.serve({
  port: process.env.PORT!,
  fetch: app.fetch,
});

console.log(`server running on port ${process.env.PORT}`);
