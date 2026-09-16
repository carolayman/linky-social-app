import axios from "axios";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPaperPlane, FaImage } from "react-icons/fa";

export default function CommentCreation({ id, user }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      content: "",
      image: null,
    },
  });

  const content = watch("content");
  const image = watch("image");

  async function createComment(values) {
    const formData = new FormData();

    if (values.content?.trim()) {
      formData.append("content", values.content);
    }

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    const response = await axios.post(
      `https://route-posts.routemisr.com/posts/${id}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    return response.data;
  }

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createComment,

    onSuccess: () => {
      reset();
      setImagePreview(null);
      queryClient.invalidateQueries({
      queryKey: ["getPostComments", id],
      });
    },
  });

  function handleCreateComment(values) {
    if (!values.content?.trim() && !values.image?.[0]) {
      return;
    }

    mutate(values);
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    setImagePreview(null);

    setValue("image", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
      <form
        onSubmit={handleSubmit(handleCreateComment)}
        className="flex items-center gap-3"
      >
        {/* {user?.photo ? (
          <img
            src={user.photo}
            alt={user?.name || "User"}
            className="h-10 w-10 shrink-0 rounded-full border border-gray-100 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-500">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )} */}

        {/* Input Container */}
        <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition focus-within:border-sky-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
          
          {/* Comment Input */}
          <input
            {...register("content")}
            type="text"
            placeholder="Write a comment..."
            disabled={isPending}
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
          />

          {/* Hidden Image Input */}
          <input
            {...register("image")}
            ref={(e) => {
              register("image").ref(e);
              fileInputRef.current = e;
            }}
            type="file"
            accept="image/*"
            onChange={(e) => {
              register("image").onChange(e);
              handleImageChange(e);
            }}
            className="hidden"
          />

          {/* Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            aria-label="Add image"
            className="ml-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-sky-50 hover:text-sky-500 disabled:opacity-50"
          >
            <FaImage size={15} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={
              isPending ||
              (!content?.trim() && !image?.[0])
            }
            aria-label="Post comment"
            className="ml-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-200 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <FaPaperPlane size={13} />
            )}
          </button>
        </div>
      </form>

      {/* Image Preview
      {imagePreview && (
        <div className="ml-13 mt-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Selected"
              className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs text-white transition hover:bg-red-500"
            >
              ×
            </button>
          </div>

          <span className="text-xs text-gray-400">
            Image attached
          </span>
        </div>
      )} */}

      {/* Error Message */}
      {isError && (
        <p className="ml-13 mt-2 text-xs text-red-500">
          {error?.response?.data?.message ||
            "Failed to post your comment."}
        </p>
      )}
    </div>
  );
}