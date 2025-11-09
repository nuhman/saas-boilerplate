import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext } from "./lib/context";
import { appRouter } from "./router";

const server = fastify({
  maxParamLength: 5000,
});

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

server.register(fastifyCors, {
  origin: CLIENT_URL,
  credentials: true,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const start = async () => {
  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
    console.log("Server is running on port:", PORT);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
