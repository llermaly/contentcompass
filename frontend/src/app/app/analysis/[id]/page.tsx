"use client";

import AnalysisCard from "@/components/analysis-card";
import Loader from "@/components/loader";
import { api } from "@/trpc/react";
import { Analysis } from "@/types/types";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = api.analysis.getOne.useQuery(params.id);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const analysis = JSON.parse(data?.body! ?? "[]") as Analysis[];

  return (
    <div>
      <h2 className="text-3xl font-bold">{data?.name}</h2>
      <div className="mt-4 flex items-center justify-between gap-8">
        <div>
          <h3 className="text-center text-xl font-bold">Guidelines content</h3>
          <img
            src={data?.guidelines.content.thumbnail}
            className="h-48 w-80 rounded object-cover"
          />
          <Link
            className="block w-80 text-center hover:underline"
            href={`/app/content/${data?.guidelines.content.id}`}
          >
            {data?.guidelines.content.name}
          </Link>
        </div>
        <div>
          <h3 className="text-center text-xl font-bold">Comparision content</h3>
          <img
            src={data?.content.thumbnail}
            className="h-48 w-80 rounded object-cover"
          />
          <Link
            className="block w-80 text-center hover:underline"
            href={`/app/content/${data?.content.id}`}
          >
            {data?.content.name}
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {analysis?.map((analysis, idx) => (
          <AnalysisCard key={idx} analysis={analysis} />
        ))}
      </div>
    </div>
  );
}
