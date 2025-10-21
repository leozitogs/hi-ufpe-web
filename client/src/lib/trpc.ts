import { createTRPCReact } from "@trpc/react-query";
import type { appRouter } from "../../../server/routers";

export const trpc = createTRPCReact<typeof appRouter>();