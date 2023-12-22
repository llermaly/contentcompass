import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const analysisRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        guidelineId: z.string(),
        body: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const create = await ctx.db.analysis.create({
        data: {
          contentId: input.contentId,
          guidelineId: input.guidelineId,
          body: input.body,
          name: input.name,
        },
      });

      return create;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const remove = await ctx.db.analysis.delete({
        where: {
          id: input,
        },
      });

      return remove;
    }),
  list: protectedProcedure.query(async ({ input, ctx }) => {
    const list = await ctx.db.analysis.findMany({
      where: {
        content: {
          userId: ctx.session.userId,
        },
      },
    });

    return list;
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const getOne = await ctx.db.analysis.findUnique({
      where: {
        id: input,
      },
      select: {
        id: true,
        name: true,
        body: true,
        guidelineId: true,
        contentId: true,
        content: true,
        guidelines: {
          select: {
            content: true,
          },
        },
      },
    });

    return getOne;
  }),
});
