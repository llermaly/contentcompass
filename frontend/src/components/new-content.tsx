"use client";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "react-toastify";

const NewContent = () => {
  const create = api.content.create.useMutation();
  const extractBody = api.user.extractBody.useMutation();
  const utils = api.useUtils();

  const [name, setName] = React.useState<string>("");
  const [source, setSource] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  const [thumbnail, setThumbnail] = React.useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleExtractBody = () => {
    extractBody.mutate(
      {
        content: source,
      },
      {
        onSuccess: (data) => {
          setBody(data.data!);
          setName(data.meta.title);
          setThumbnail(data.meta.thumbnail);
          toast.success("Body extracted");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  const handleSave = () => {
    create.mutate(
      {
        name,
        source,
        body,
        thumbnail,
      },
      {
        onSuccess: () => {
          setName("");
          setSource("");
          setBody("");
          setThumbnail("");
          toast.success("Content created");
          utils.content.list.invalidate();
        },
      },
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold">New Content</h2>
      {thumbnail && <img src={thumbnail} alt="Content" className="mb-2 h-64" />}

      <div>
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
          <label className="text-gray-500">Data source</label>
          <input
            value={source}
            onChange={handleSourceChange}
            type="text"
            placeholder="Enter url"
            className="input input-bordered w-full"
          />
        </div>

        <button
          className="btn btn-neutral mt-4 w-full"
          onClick={handleExtractBody}
          disabled={extractBody.isLoading || create.isLoading}
        >
          Extract body
        </button>
      </div>

      <div className="mt-6">
        <label className="text-gray-500">Extracted body</label>
        <textarea
          value={body}
          onChange={handleBodyChange}
          className="textarea textarea-bordered w-full"
          placeholder="Bio"
          rows={6}
        ></textarea>
        <button
          className="btn btn-neutral mt-4 w-full"
          onClick={handleSave}
          disabled={create.isLoading || !body || !name || !source}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NewContent;
