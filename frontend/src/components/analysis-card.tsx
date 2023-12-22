import { Analysis } from "@/types/types";
import React from "react";

interface Props {
  analysis: Analysis;
}

const AnalysisCard = ({ analysis }: Props) => {
  return (
    <div className="rounded-lg border px-4 py-2 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold">{analysis.title}</h3>
        <span
          className={`${
            analysis.score > 5 ? "bg-green-500" : "bg-red-500"
          } rounded-full px-3 py-1 font-bold text-white`}
        >
          {analysis.score}
        </span>
      </div>
      <p>{analysis.feedback}</p>
    </div>
  );
};

export default AnalysisCard;
