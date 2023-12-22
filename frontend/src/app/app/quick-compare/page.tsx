"use client";
import { Analysis, Meta } from "@/types/types";
import { api } from "@/trpc/react";
import { getScoreText } from "@/utils/utils";
import { toast } from "react-toastify";
import AnalysisCard from "@/components/analysis-card";
import Loader from "@/components/loader";
import React from "react";

const QuickComparePage = () => {
  const endToEnd = api.user.endToEnd.useMutation();

  const [guidelineSource, setGuidelineSource] = React.useState<string>("");
  const [contentSource, setContentSource] = React.useState<string>("");
  const [analysisResult, setAnalysisResult] = React.useState<Analysis[]>([]);
  const [sourceMetadata, setSourceMetadata] = React.useState<Meta | null>(null);
  const [destMetadata, setDestMetadata] = React.useState<Meta | null>(null);

  const handleGuidelineSourceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGuidelineSource(e.target.value);
  };

  const handleContentSourceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setContentSource(e.target.value);
  };

  const handleCompare = () => {
    setAnalysisResult([]);
    setSourceMetadata(null);
    setDestMetadata(null);
    endToEnd.mutate(
      {
        source_url: guidelineSource,
        dest_url: contentSource,
      },
      {
        onSuccess: (data) => {
          if (data.ok) {
            setAnalysisResult(data.data!);
            setSourceMetadata(data.metadata.source);
            setDestMetadata(data.metadata.dest);
            toast.success("Analysis completed");
          } else {
            toast.error("Analysis failed");
          }
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  const score =
    analysisResult?.reduce(
      (acc, cur) => acc + cur.score / analysisResult?.length,
      0,
    ) ?? undefined;

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold">Quick compare</h2>
      <p className="mb-8">
        Make a quick comparision by just entering the youtube urls
      </p>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6 flex flex-col">
          <label className="text-gray-500">Guidelines source url</label>
          <input
            value={guidelineSource}
            onChange={handleGuidelineSourceChange}
            type="text"
            placeholder="Enter url"
            className="input input-bordered w-full"
          />
        </div>
        <div className="col-span-6 flex flex-col">
          <label className="text-gray-500">Comparision source url</label>
          <input
            value={contentSource}
            onChange={handleContentSourceChange}
            type="text"
            placeholder="Enter url"
            className="input input-bordered w-full"
          />
        </div>
        <button
          className="btn btn-neutral col-span-12"
          onClick={handleCompare}
          disabled={endToEnd.isLoading || !guidelineSource || !contentSource}
        >
          Compare
        </button>
      </div>
      {endToEnd.isLoading && (
        <div className="mt-4 flex items-center justify-center gap-2">
          Analyzing guidelines vs content... <Loader />
        </div>
      )}
      {sourceMetadata && destMetadata && (
        <div className="mt-4 flex items-center justify-between gap-8">
          <div>
            <h3 className="text-center text-xl font-bold">
              Guidelines content
            </h3>
            <img
              src={sourceMetadata.thumbnail}
              className="h-48 w-80 rounded object-cover"
            />
            <span className="block w-80 text-center">
              {sourceMetadata.title}
            </span>
          </div>
          <div>
            <h3 className="text-center text-xl font-bold">
              Comparision content
            </h3>
            <img
              src={destMetadata.thumbnail}
              className="h-48 w-80 rounded object-cover"
            />
            <span className="block w-80 text-center">{destMetadata.title}</span>
          </div>
        </div>
      )}

      {score && analysisResult?.length > 0 ? (
        <div className="mt-4">
          <span
            className={`${
              score && score > 0.5 ? "text-green-500" : "text-red-500"
            } text-xl font-bold`}
          >
            Your score is {score}/10
          </span>
          <p className="mt-1"> {getScoreText(score)}</p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-4">
        {analysisResult?.map((analysis, idx) => (
          <AnalysisCard key={idx} analysis={analysis} />
        ))}
      </div>
    </div>
  );
};

export default QuickComparePage;
