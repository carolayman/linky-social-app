import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiPokerHeartsFill } from "react-icons/ri";
import { likePost } from "../../Api/likePost.api";
import { getUserProfile } from "../../Api/getUserProfile.api";

export default function LikeButton({
  postId,
  likesCount,
  likes = [],
}) {
  const queryClient = useQueryClient();

  // Get current logged-in user
  const { data: user } = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: getUserProfile,
    select: (data) => data?.data?.data?.user,
  });

  const currentUserId = user?._id;

  // Check if the current user liked this post
  const isLiked = likes.includes(currentUserId);

  // Like / Unlike mutation
  const { mutate, isPending } = useMutation({
    mutationFn: likePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
    },
  });

  function handleLike() {
    mutate(postId);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isPending}
      aria-label={isLiked ? "Unlike post" : "Like post"}
      className={`group flex items-center gap-1 text-sm transition-all duration-200 ${
        isLiked
          ? "text-sky-500"
          : "text-gray-500 hover:text-sky-500"
      }`}
    >
      <span
        className={`flex items-center justify-center transition-transform duration-200 ${
          isPending
            ? "scale-90 opacity-60"
            : "group-hover:scale-110"
        }`}
      >
        {isLiked ? (
          <RiPokerHeartsFill size={20} className="text-sky-500" />
        ) : (
          <RiPokerHeartsFill  size={20} />
        )}
      </span>

      <span>
        {likesCount || 0}
      </span>
    </button>
  );
}