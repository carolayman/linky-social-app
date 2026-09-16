import React, { useContext, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaBookmark, FaComment } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import { TbDotsVertical } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Dropdown, Label } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import Comment from "../Comment/Comment";
import LikeButton from "../LikeButton/LikeButton";
import { deletePost } from "../../Api/deletePost.api";
import { followUser } from "../../Api/followUser.api";
import { UserContext } from "../../Context/UserContext";
import UpdatePostModel from "../UpdatePostModal/UpdatePostModal";

dayjs.extend(relativeTime);

export default function CardPost({ post }) {
  const user = post?.user;
  const userId = user?._id;

  const { LoggedUserId } = useContext(UserContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const queryClient = useQueryClient();

  const isBookmarked =
    post?.bookMark ||
    post?.isBookmarked ||
    post?.bookmarked;

  function bookMark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post?.id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const {
    mutate: bookMarkedMutate,
    isPending: bookMarkedIsPending,
  } = useMutation({
    mutationFn: bookMark,

    onSuccess: () => {
      toast.success(
        isBookmarked
          ? "Post removed from bookmarks"
          : "Post bookmarked successfully!"
      );

      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserBookmarks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update bookmark"
      );
    },
  });

  const {
    mutate: delMutate,
    isPending: delIsPending,
  } = useMutation({
    mutationFn: () =>
      deletePost({
        id: post?.id,
      }),

    onSuccess: () => {
      toast.success("Post deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserProfile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserBookmarks"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete post"
      );
    },
  });

  const {
    mutate: followMutate,
    isPending: followIsPending,
  } = useMutation({
    mutationFn: () => followUser(userId),

    onSuccess: () => {
      setIsFollowing((prev) => !prev);

      toast.success(
        isFollowing
          ? "Unfollowed successfully"
          : "Followed successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getUserProfile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["followSuggestions"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update follow status"
      );
    },
  });

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

      <div className="flex items-center justify-between p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">

          {user?.photo ? (
            <img
              src={user.photo}
              alt={user?.name || "User"}
              className="h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover sm:h-11 sm:w-11"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-500 sm:h-11 sm:w-11">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
              {user?.name || "User"}
            </h3>

            <p className="truncate text-xs text-gray-400 sm:text-sm">
              {dayjs(post?.createdAt).fromNow()}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          {userId && userId !== LoggedUserId && (
            <button
              type="button"
              onClick={() => followMutate()}
              disabled={followIsPending}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isFollowing
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-sky-500 text-white hover:bg-sky-600"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {followIsPending
                ? "..."
                : isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
          )}

          <Dropdown>
            <Dropdown.Trigger>
              <button
                type="button"
                className="rounded-full p-1 text-gray-600 transition-colors hover:text-sky-500 focus:outline-none"
              >
                <TbDotsVertical size={20} />
              </button>
            </Dropdown.Trigger>

            <Dropdown.Popover className="min-w-[170px] rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "update-post") {
                    setIsEditModalOpen(true);
                  }

                  if (key === "delete-post") {
                    Swal.fire({
                      title: "Delete Post?",
                      text: "Are you sure you want to delete this post? This action cannot be undone.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it",
                      cancelButtonText: "Cancel",
                      confirmButtonColor: "#ef4444",
                      cancelButtonColor: "#6b7280",
                      reverseButtons: true,
                      customClass: {
                        popup: "rounded-2xl",
                        confirmButton:
                          "rounded-xl px-5 py-2.5",
                        cancelButton:
                          "rounded-xl px-5 py-2.5",
                      },
                    }).then((result) => {
                      if (result.isConfirmed) {
                        delMutate();
                      }
                    });
                  }

                  if (key === "bookmark-post") {
                    bookMarkedMutate();
                  }
                }}
              >

                <Dropdown.Item
                  id="bookmark-post"
                  textValue={
                    isBookmarked
                      ? "Remove Bookmark"
                      : "Save Post"
                  }
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-gray-700 outline-none transition hover:bg-sky-50 hover:text-sky-600 focus:bg-sky-50"
                  isDisabled={bookMarkedIsPending}
                >
                  {isBookmarked ? (
                    <FaBookmark
                      size={18}
                      className="text-sky-500"
                    />
                  ) : (
                    <FaRegBookmark
                      size={18}
                      className="text-gray-500"
                    />
                  )}

                  <Label className="font-medium">
                    {isBookmarked
                      ? "Remove Bookmark"
                      : "Save Post"}
                  </Label>
                </Dropdown.Item>

                {userId === LoggedUserId && (
                  <>
                    <Dropdown.Item
                      id="update-post"
                      textValue="Update Post"
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-gray-700 outline-none transition hover:bg-sky-50 hover:text-sky-600 focus:bg-sky-50"
                    >
                      <RxUpdate
                        size={18}
                        className="text-gray-500"
                      />

                      <Label className="font-medium">
                        Update Post
                      </Label>
                    </Dropdown.Item>

                    <Dropdown.Item
                      id="delete-post"
                      textValue="Delete Post"
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 outline-none transition hover:bg-red-50 focus:bg-red-50"
                    >
                      <MdDelete
                        size={18}
                        className="text-red-500"
                      />

                      <Label className="font-medium text-red-600">
                        Delete Post
                      </Label>
                    </Dropdown.Item>
                  </>
                )}

              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

        </div>
      </div>

      <Link to={`/postDetails/${post?.id}`}>
        {post?.body && (
          <div className="px-4 pb-4 sm:px-5">
            <p className="break-words whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:text-base">
              {post.body}
            </p>
          </div>
        )}

        {post?.image && (
          <div className="w-full bg-gray-100">
            <img
              src={post.image}
              alt="Post"
              className="max-h-[500px] w-full object-cover"
            />
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-5 sm:gap-8">

          <LikeButton
            postId={post?.id}
            likesCount={post?.likesCount}
            likes={post?.likes}
          />

          <Link to={`/postDetails/${post?.id}`}>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors duration-200 hover:text-sky-500"
            >
              <FaComment />
              <span>
                {post?.commentsCount || 0}
              </span>
              <span className="sr-only">
                comments
              </span>
            </button>
          </Link>

          <button
            type="button"
            className="flex items-center gap-1 text-sm text-gray-500 transition-colors duration-200 hover:text-sky-500"
          >
            <FaShareFromSquare />
            <span>
              {post?.sharesCount || 0}
            </span>
            <span className="sr-only">
              shares
            </span>
          </button>

        </div>
      </div>

      {post?.topComment && (
        <Comment comment={post.topComment} />
      )}

      <UpdatePostModel
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

    </article>
  );
}