import React from "react";
import { BeatLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <BeatLoader
        size={22}
        color="#3B82F6"
        aria-label="Loading"
      />
    </div>
  );
}