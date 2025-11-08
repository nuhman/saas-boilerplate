import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext } from "./context";
import { appRouter } from "./router";

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyCors, {
  origin: "http://localhost:5173",
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log('Server is running on port 3000');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();