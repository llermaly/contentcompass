"use client";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "react-toastify";

const NewGuideline = () => {
  const contentList = api.content.list.useQuery();
  const create = api.guideline.create.useMutation();
  const extractGuidelines = api.user.extractGuidelines.useMutation();
  const utils = api.useUtils();

  const [name, setName] = React.useState<string>("");
  const [selectedContent, setSelectedContent] = React.useState<string>("");
  const [extractedGuidelines, setExtractedGuidelines] =
    React.useState<string>("");

  const handleContentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContent(e.target.value);
  };

  const handleExtractedGuidelinesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setExtractedGuidelines(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleExtractGuidelines = () => {
    extractGuidelines.mutate(
      {
        contentId: selectedContent,
      },
      {
        onSuccess: (data) => {
          let guidelinesString = "";

          data.data?.forEach((guideline) => {
            guidelinesString += guideline.title + "\n";
          });

          setExtractedGuidelines(guidelinesString);

          toast.success("Guidelines extracted");
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
        body: extractedGuidelines,
        name,
      },
      {
        onSuccess: () => {
          setSelectedContent("");
          setExtractedGuidelines("");
          setName("");
          toast.success("Guideline created");
          utils.guideline.list.invalidate();
        },
      },
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold">New Guideline</h2>
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
        <button
          onClick={handleExtractGuidelines}
          disabled={extractGuidelines.isLoading || create.isLoading}
          className="btn btn-neutral mt-4 w-full"
        >
          Extract guidelines
        </button>
      </div>

      <div className="mt-6">
        <label className="text-gray-500">Extracted guidelines</label>

        <textarea
          value={extractedGuidelines}
          onChange={handleExtractedGuidelinesChange}
          className="textarea textarea-bordered w-full"
          placeholder="Bio"
          rows={6}
        ></textarea>
        <button
          className="btn btn-neutral mt-4 w-full"
          onClick={handleCreate}
          disabled={
            extractGuidelines.isLoading ||
            create.isLoading ||
            !extractedGuidelines ||
            !name ||
            !selectedContent
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NewGuideline;
