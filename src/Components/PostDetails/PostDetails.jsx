import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPostDetails } from "../../Api/getPostDetails.api";
import { getComments } from "../../Api/getComments.api";
import Loading from "../Loading/Loading";
import Comment from "../Comment/Comment";
import CommentCreation from "../CommentCreation/CommentCreation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaGlobe, FaComment } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { FaShareFromSquare } from "react-icons/fa6";
import LikeButton from "../LikeButton/LikeButton";

dayjs.extend(relativeTime);

export default function PostDetails() {
  const { id } = useParams();

  // Get Post
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: () => getPostDetails(id),
    select: (data) => data?.data?.data?.post,
  });

  // Get Comments
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["getPostComments", id],
    queryFn: () => getComments(id),
    select: (data) => data?.data?.data?.comments || [],
  });

  // Post Loading
  if (isLoading) {
    return <Loading />;
  }

  // Post Error
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="alert alert-error w-full max-w-lg shadow-sm">

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
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000 18z"
              />
            </svg>

            <div>
              <h3 className="font-bold">
                Something went wrong!
              </h3>

              <p className="text-sm">
                {error?.message || "Unable to load this post."}
              </p>
            </div>

            <button
              onClick={() => refetch()}
              className="btn btn-sm"
            >
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  // Post Not Found
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">

          <div className="rounded-2xl bg-white px-8 py-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-gray-700">
              Post not found
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              This post may have been deleted or is no longer available.
            </p>

          </div>

        </div>
      </div>
    );
  }

  const user = post?.user;

  return (
    <>
      <title>{user?.name || "Post"} | Linky</title>

      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:py-8">

        <div className="mx-auto w-full max-w-3xl">

          {/* Post */}
          <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6">

              <div className="flex min-w-0 items-center gap-3">

                {/* Avatar */}
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user?.name || "User"}
                    className="h-11 w-11 shrink-0 rounded-full border border-gray-100 object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-500">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                {/* User Info */}
                <div className="min-w-0">

                  <h2 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                    {user?.name || "User"}
                  </h2>

                  <p className="truncate text-xs text-gray-400 sm:text-sm">
                    {dayjs(post?.createdAt).fromNow()}
                  </p>

                </div>

              </div>

              {/* Privacy */}
              <div className="flex shrink-0 items-center gap-1.5 text-sky-400">

                <FaGlobe size={14} />

                <span className="hidden text-xs capitalize sm:block">
                  {post?.privacy || "public"}
                </span>

              </div>

            </div>

            {/* Body */}
            {post?.body && (
              <div className="px-5 pb-5 sm:px-6">

                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700 sm:text-base">
                  {post.body}
                </p>

              </div>
            )}

            {/* Post Image */}
            {post?.image && (
              <div className="w-full bg-gray-100">

                <img
                  src={post.image}
                  alt="Post"
                  className="block max-h-[650px] w-full object-contain"
                />

              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-6 sm:gap-8">

                {/* Likes */}
                <LikeButton
                  postId={post?.id}
                  likesCount={post?.likesCount}
                  likes={post?.likes}
                />

                {/* Comments */}
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-sky-500"
                >
                  <FaComment size={16} />
                  <span>
                    {post?.commentsCount || 0}
                  </span>
                </button>

                {/* Shares */}
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-sky-500"
                >
                  <FaShareFromSquare size={16} />
                  <span>
                    {post?.sharesCount || 0}
                  </span>
                </button>

              </div>

              {/* Bookmark */}
              {post?.bookmarked && (
                <span className="text-xs font-medium text-sky-500">
                  Saved
                </span>
              )}

            </div>

            {/* Comments Section */}
            {isCommentsLoading ? (
              <div className="px-5 py-6 text-center text-sm text-gray-400">
                Loading comments...
              </div>
            ) : isCommentsError ? (
              <div className="px-5 py-6 text-center">

                <p className="text-sm text-red-500">
                  {commentsError?.message || "Unable to load comments."}
                </p>

                <button
                  onClick={() => refetchComments()}
                  className="mt-2 text-sm font-medium text-sky-500 hover:text-sky-600"
                >
                  Try Again
                </button>

              </div>
            ) : comments.length > 0 ? (
              comments
                .slice()
                .reverse()
                .map((comment) => (
                  <Comment comment={comment} key={comment._id}/>
                ))
            ) : (
              <div className="px-5 py-6 text-center text-sm text-gray-400">
                No comments yet.
              </div>
            )}

            {/* Create Comment */}
            <CommentCreation id={post._id || post.id} />

          </article>

        </div>

      </div>
    </>
  )
}