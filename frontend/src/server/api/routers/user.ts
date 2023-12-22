import axiosInstance from "@/utils/axios";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  AnalyzeAPIResponse,
  EndToEndAPIResponse,
  ExtractBodyAPIResponse,
  ExtractGuidelinesAPIResponse,
} from "@/types/types";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  analyze: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        guidelinesId: z.string(),
        youtube_url: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const content = await ctx.db.content.findUnique({
        where: { id: input.contentId },
      });
      const guidelines = await ctx.db.guideline.findUnique({
        where: { id: input.guidelinesId },
      });

      const { data } = await axiosInstance.post<AnalyzeAPIResponse>(
        "/analyze",
        {
          content: content?.body,
          guidelines: guidelines?.body,
          youtube_url: content?.source,
        },
      );
      return data;
    }),
  extractGuidelines: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const content = await ctx.db.content.findUnique({
        where: { id: input.contentId },
      });

      const { data } = await axiosInstance.post<ExtractGuidelinesAPIResponse>(
        "/extract-guidelines",
        { content: content?.body },
      );
      return data;
    }),
  extractBody: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data } = await axiosInstance.post<ExtractBodyAPIResponse>(
        "/extract-body",
        input,
      );
      return data;
    }),
  endToEnd: protectedProcedure
    .input(
      z.object({
        source_url: z.string(),
        dest_url: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data } = await axiosInstance.post<EndToEndAPIResponse>(
        "/end-to-end",
        input,
      );
      return data;
    }),
});
