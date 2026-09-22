import { defineConfig } from "vite";
export default defineConfig({
  esbuild: { jsx: "automatic" },
  plugins: [
    {
      name: "contract-fixture",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/avatar.svg") {
            res.setHeader("Content-Type", "image/svg+xml");
            res.end(
              '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="purple"/></svg>',
            );
          } else if (req.url === "/broken-avatar.png") {
            res.statusCode = 404;
            res.end();
          } else if (req.url === "/") {
            try {
              const { render } = await server.ssrLoadModule("/browser/server.tsx");
              res.setHeader("Content-Type", "text/html");
              res.end(await server.transformIndexHtml("/", render()));
            } catch (error) {
              next(error);
            }
          } else next();
        });
      },
    },
  ],
});
