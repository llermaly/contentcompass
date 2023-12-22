"use client";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import Link from "next/link";
import ListCard from "./list-card";
import Loader from "./loader";

const GuidelineList = () => {
  const list = api.guideline.list.useQuery();
  const remove = api.guideline.delete.useMutation();
  const utils = api.useUtils();

  const handleDelete = (id: string) => {
    remove.mutate(id, {
      onSuccess: () => {
        utils.guideline.list.invalidate();
        toast.success("Guideline deleted");
      },
    });
  };

  if (list.isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="px-4">
        <Link className="btn btn-neutral w-full" href="/app/guideline/create">
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
        {list.data?.map((guideline) => (
          <ListCard
            key={guideline.id}
            name={guideline.name}
            onDelete={() => handleDelete(guideline.id)}
            viewPath={`/app/guideline/${guideline.id}`}
            disabled={remove.isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default GuidelineList;
