import React, { useState } from "react";
import { getAllPosts } from "../../Api/getAllPosts.api";
import { getUserProfile } from "../../Api/getUserProfile.api";
import CardPost from "../CardPost/CardPost";
import Loading from "../Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";

export default function Home() {
  const [showPostModal, setShowPostModal] = useState(false);


  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
    select: (data) => data.data.posts,
  });

  const { data: user } = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: getUserProfile,
    select: (data) => data?.data?.data?.user,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="alert alert-error max-w-lg w-full shadow-lg">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
            />
          </svg>

          <div>
            <h3 className="font-bold">
              Something went wrong!
            </h3>

            <div className="text-sm">
              {error?.message || "An error occurred."}
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="btn btn-sm"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <>
      <title>Home</title>

      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:py-8">

        <div className="w-full max-w-4xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 mb-5 shadow-sm">

            <h1 className="text-2xl sm:text-3xl font-bold text-sky-500">
              Latest Posts
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              See what's happening around you
            </p>

          </div>

          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="mb-5 flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user?.name || "User"}
                className="h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-500">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <span className="text-sm text-gray-400">
              What's on your mind?
            </span>

          </button>

          <div className="flex flex-col gap-4 sm:gap-5">

            {posts.length > 0 ? (
              posts.map((post) => (
                <CardPost
                  key={post._id}
                  post={post}
                />
              ))
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <p className="text-gray-500">
                  No posts available.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {showPostModal && (
        <PostCreation
          onClose={() => setShowPostModal(false)}
        />
      )}

    </>
  );
}
