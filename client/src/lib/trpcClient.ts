import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
    }),
  ],
});
