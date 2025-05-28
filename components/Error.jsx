import React from "react";
import { useRouter } from "next/navigation";

const Error = ({ username, error }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Profile Not Found
        </h1>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
          <div className="text-sm text-gray-500">
            Looking for:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">@{username}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
