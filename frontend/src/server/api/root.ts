import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { contentRouter } from "./routers/content";
import { guidelineRouter } from "./routers/guideline";
import { analysisRouter } from "./routers/analysis";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  content: contentRouter,
  guideline: guidelineRouter,
  analysis: analysisRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
