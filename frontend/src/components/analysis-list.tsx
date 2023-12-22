"use client";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import Link from "next/link";
import ListCard from "./list-card";
import Loader from "./loader";

const AnalysisList = () => {
  const list = api.analysis.list.useQuery();
  const remove = api.analysis.delete.useMutation();
  const utils = api.useUtils();

  const handleDelete = (id: string) => {
    remove.mutate(id, {
      onSuccess: () => {
        utils.analysis.list.invalidate();
        toast.success("Analysis deleted");
      },
    });
  };

  if (list.isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="px-4">
        <Link className="btn btn-neutral w-full" href="/app/analysis/create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            data-slot="icon"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Add new
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {list.data?.map((analysis) => (
          <ListCard
            key={analysis.id}
            name={analysis.name}
            onDelete={() => handleDelete(analysis.id)}
            viewPath={`/app/analysis/${analysis.id}`}
            disabled={remove.isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalysisList;
