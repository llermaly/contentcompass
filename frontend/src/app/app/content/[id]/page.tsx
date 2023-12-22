"use client";

import Loader from "@/components/loader";
import { api } from "@/trpc/react";

export default function Page({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = api.content.getOne.useQuery(params.id);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold">{data?.name}</h2>
      {data?.thumbnail && (
        <img src={data?.thumbnail} alt="Content" className="my-2 h-64" />
      )}
      <a className="mt-4 hover:underline" href={data?.source} target="_blank">
        {data?.source}
      </a>
      <h3 className="mt-2 text-2xl font-semibold">Extracted body</h3>
      {data?.body.split("\n").map((line, index) => <p key={index}>{line}</p>)}
    </div>
  );
}
