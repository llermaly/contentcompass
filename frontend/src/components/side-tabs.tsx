"use client";
import { useState } from "react";
import GuidelineList from "./guideline-list";
import ContentList from "./content-list";
import AnalysisList from "./analysis-list";

const SideTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      title: "Content",
      component: <ContentList />,
    },
    {
      id: 1,
      title: "Guidelines",
      component: <GuidelineList />,
    },
    {
      id: 2,
      title: "Analysis",
      component: <AnalysisList />,
    },
  ];
  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered py-3">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            role="tab"
            className={`tab ${tab.id === activeTab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </a>
        ))}
      </div>
      <div className="mt-4">{tabs?.[activeTab]?.component}</div>
    </div>
  );
};

export default SideTabs;
