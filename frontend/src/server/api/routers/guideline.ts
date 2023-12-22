import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const guidelineRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        body: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const create = await ctx.db.guideline.create({
        data: {
          contentId: input.contentId,
          body: input.body,
          name: input.name,
        },
      });

      return create;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const remove = await ctx.db.guideline.delete({
        where: {
          id: input,
        },
      });

      return remove;
    }),
  list: protectedProcedure.query(async ({ input, ctx }) => {
    const list = await ctx.db.guideline.findMany({
      where: {
        content: {
          userId: ctx.session.userId,
        },
      },
    });

    return list;
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const getOne = await ctx.db.guideline.findUnique({
      where: {
        id: input,
      },
      select: {
        name: true,
        body: true,
        content: true,
        id: true,
      },
    });

    return getOne;
  }),
});
