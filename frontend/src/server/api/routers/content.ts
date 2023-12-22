import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const contentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        source: z.string(),
        body: z.string(),
        thumbnail: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const create = await ctx.db.content.create({
        data: {
          name: input.name,
          source: input.source,
          body: input.body,
          userId: ctx.session.userId,
          thumbnail: input.thumbnail,
        },
      });

      return create;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const remove = await ctx.db.content.delete({
        where: {
          id: input,
          userId: ctx.session.userId,
        },
      });

      return remove;
    }),
  list: protectedProcedure.query(async ({ input, ctx }) => {
    const list = await ctx.db.content.findMany({
      where: {
        userId: ctx.session.userId,
      },
    });

    return list;
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const getOne = await ctx.db.content.findUnique({
      where: {
        id: input,
      },
    });

    return getOne;
  }),
});
