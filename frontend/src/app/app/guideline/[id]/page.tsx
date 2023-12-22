"use client";

import Loader from "@/components/loader";
import { api } from "@/trpc/react";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const { data, isLoading, isError } = api.guideline.getOne.useQuery(params.id);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold">{data?.name}</h2>
      <h3 className="mb-2 mt-2">
        Extracted from{" "}
        <Link
          href={`/app/content/${data?.content.id}`}
          className="font-semibold hover:underline"
        >
          {data?.content?.name}
        </Link>
      </h3>
      <img src={data?.content?.thumbnail} alt="Content" className="my-2 h-64" />
      <h3 className="mt-2 text-2xl font-bold">Guidelines</h3>
      {data?.body.split("\n").map((line, index) => <p key={index}>{line}</p>)}
    </div>
  );
}
