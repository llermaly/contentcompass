"use client";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-5xl font-bold text-blue-600">Introducing Content Compass</h1>
      <p className="mb-6 text-gray-700 text-lg">
        <b>Content Compass</b> is an innovative AI-powered tool designed to
        revolutionize the way you align videos with your specific content
        guidelines. Whether you're a marketer, educator, content creator, or
        business professional, Content Compass offers you a seamless way to
        ensure your content not only meets but exceeds your desired standards.
        Input guidelines through text or directly from a YouTube video, and let
        our advanced Gemini AI do the rest.
      </p>
      <div className="flex justify-center items-center gap-8">
        <img src="/demo.png" alt="Content Compass Demo" className="rounded-xl shadow-lg" style={{ height: '320px', width: 'auto' }} />
      </div>
      <div className="my-8 grid gap-6 text-center md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="rounded-lg border p-6 transition duration-300 hover:shadow-xl">
            <h3 className={`text-lg font-semibold ${step.color}`}>
              {step.title}
            </h3>
            <p className="mt-4 text-gray-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Step 1: Input Guidelines",
    description: "Start by inputting your content guidelines, either as text or by providing a YouTube video. Our system extracts key elements to use as a benchmark.",
    color: "text-green-500",
  },
  {
    title: "Step 2: Analyze Your Content",
    description: "Upload your content, and Content Compass will perform a comprehensive analysis, comparing your video and its transcript against the set guidelines.",
    color: "text-orange-500",
  },
  {
    title: "Step 3: Receive Insightful Feedback",
    description: "Get detailed feedback and scores, highlighting how your content aligns with the guidelines. Understand the areas of excellence and those needing improvement.",
    color: "text-red-500",
  },
];
