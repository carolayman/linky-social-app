import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Comment({ comment }) {
  const user = comment?.commentCreator;

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-start gap-3">

        {/* User Avatar */}
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

        {/* Comment Content */}
        <div className="min-w-0 flex-1">

          {/* Comment Bubble */}
          <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-gray-50 px-4 py-3">

            {/* Name + Time */}
            <div className="flex items-center justify-between gap-3">

              <h4 className="truncate text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </h4>

              <span className="shrink-0 text-xs text-gray-400">
                {dayjs(comment?.createdAt).fromNow()}
              </span>

            </div>

            {/* Comment Text */}
            {comment?.content && (
              <p className="mt-1.5 break-words text-sm leading-6 text-gray-600">
                {comment.content}
              </p>
            )}

            {/* Comment Image */}
            {comment?.image && (
              <img
                src={comment.image}
                alt="Comment attachment"
                className="mt-3 max-h-80 max-w-full rounded-xl object-cover"
              />
            )}

          </div>

          {/* Comment Actions */}
          <div className="mt-1 flex items-center gap-4 px-2">

            <button
              type="button"
              className="text-xs font-medium text-gray-400 transition-colors hover:text-sky-500"
            >
              Like
            </button>

            <button
              type="button"
              className="text-xs font-medium text-gray-400 transition-colors hover:text-sky-500"
            >
              Reply
            </button>

            {/* <button
              type="button"
              className="text-xs font-medium text-gray-400 transition-colors hover:text-sky-500"
            >
              Delete
            </button> */}

          </div>

        </div>

      </div>
    </div>
  )
}