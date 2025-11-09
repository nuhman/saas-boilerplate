import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext } from "./lib/context";
import { appRouter } from "./router";
import { auth } from "./lib/auth";

const server = fastify({
  maxParamLength: 5000,
});

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

server.register(fastifyCors, {
  origin: CLIENT_URL,
  credentials: true,
});

server.all("/api/auth/*", async (request, reply) => {
  const response = await auth.handler(
    new Request(
      `${request.protocol}://${request.hostname}${request.url}`,
      {
        method: request.method,
        headers: request.headers as Record<string, string>,
        body: request.method !== "GET" && request.method !== "HEAD" 
          ? JSON.stringify(request.body) 
          : undefined,
      }
    )
  );

  reply.status(response.status);
  
  response.headers.forEach((value, key) => {
    reply.header(key, value);
  });

  return reply.send(await response.text());
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
