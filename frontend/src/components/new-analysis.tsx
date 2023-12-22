"use client";
import { Analysis } from "@/types/types";
import { api } from "@/trpc/react";
import { getScoreText } from "@/utils/utils";
import { toast } from "react-toastify";
import AnalysisCard from "./analysis-card";
import Loader from "./loader";
import React from "react";

const NewAnalysis = () => {
  const contentList = api.content.list.useQuery();
  const guidelineList = api.guideline.list.useQuery();
  const create = api.analysis.create.useMutation();
  const analyze = api.user.analyze.useMutation();
  const utils = api.useUtils();

  const [name, setName] = React.useState<string>("");
  const [selectedContent, setSelectedContent] = React.useState<string>("");
  const [selectedGuideline, setSelectedGuideline] = React.useState<string>("");

  const [analysisResult, setAnalysisResult] = React.useState<Analysis[]>([]);

  const guideline = api.guideline.getOne.useQuery(selectedGuideline, {
    enabled: !!selectedGuideline,
  });

  const content = api.content.getOne.useQuery(selectedContent, {
    enabled: !!selectedContent,
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContent(e.target.value);
  };

  const handleGuidelineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGuideline(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAnalyze = () => {
    analyze.mutate(
      {
        contentId: selectedContent,
        guidelinesId: selectedGuideline,
      },
      {
        onSuccess: (data) => {
          if (data.ok) {
            setAnalysisResult(data.data!);
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

  const handleCreate = () => {
    create.mutate(
      {
        contentId: selectedContent,
        guidelineId: selectedGuideline,
        body: JSON.stringify(analysisResult),
        name,
      },
      {
        onSuccess: (data) => {
          setSelectedContent("");
          setSelectedGuideline("");
          setName("");
          setAnalysisResult([]);
          toast.success("Analysis saved");
          utils.analysis.list.invalidate();
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
      <h2 className="mb-4 text-3xl font-bold">New Analysis</h2>
      <div className="flex flex-col">
        <label className="text-gray-500">Name</label>
        <input
          value={name}
          onChange={handleNameChange}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>
      <div className="mt-2 flex flex-col">
        <label className="text-gray-500">Select content</label>
        <select
          className="select select-bordered w-full"
          onChange={handleContentChange}
        >
          <option value="">Select option</option>
          {contentList.data?.map((content) => (
            <option key={content.id} value={content.id}>
              {content.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 flex flex-col">
        <label className="text-gray-500">Select guideline</label>
        <select
          className="select select-bordered w-full"
          onChange={handleGuidelineChange}
        >
          <option value="">Select option</option>
          {guidelineList.data?.map((guideline) => (
            <option key={guideline.id} value={guideline.id}>
              {guideline.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-neutral mt-4 w-full"
          onClick={handleAnalyze}
          disabled={
            create.isLoading ||
            analyze.isLoading ||
            !selectedContent ||
            !selectedGuideline ||
            !name
          }
        >
          Analyze
        </button>
        {analyze.isLoading && (
          <div className="mt-4 flex items-center justify-center gap-2">
            Analyzing guidelines vs content... <Loader />
          </div>
        )}
        {guideline.data && content.data && (
          <div className="mt-4 flex items-center justify-between gap-8">
            <div>
              <h3 className="text-center text-xl font-bold">
                Guidelines content
              </h3>
              <img
                src={guideline.data?.content.thumbnail}
                className="h-48 w-80 rounded object-cover"
              />
              <span className="block w-80 text-center hover:underline">
                {guideline.data?.content.name}
              </span>
            </div>
            <div>
              <h3 className="text-center text-xl font-bold">
                Comparision content
              </h3>
              <img
                src={content?.data?.thumbnail}
                className="h-48 w-80 rounded object-cover"
              />
              <span className="block w-80 text-center hover:underline">
                {content?.data?.name}
              </span>
            </div>
          </div>
        )}

        {score && analysisResult?.length > 0 ? (
          <div className="mt-4">
            <span
              className={`${
                score && score > 5 ? "text-green-500" : "text-red-500"
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
        {analysisResult?.length > 0 && (
          <button
            className="btn btn-neutral mt-4 w-full"
            onClick={handleCreate}
            disabled={
              create.isLoading ||
              analyze.isLoading ||
              !selectedContent ||
              !selectedGuideline ||
              !name ||
              !analysisResult ||
              analysisResult.length === 0
            }
          >
            Save analysis
          </button>
        )}
      </div>
    </div>
  );
};

export default NewAnalysis;
