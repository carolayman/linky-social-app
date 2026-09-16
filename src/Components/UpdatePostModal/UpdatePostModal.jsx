import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaImage, FaTimes } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { updatePostApi } from "../../Api/updatePost.api";

export default function UpdatePostModal({ post, isOpen, onClose }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (post) {
      setContent(post?.body || post?.content || "");
      setImagePreview(post?.image || null);
      setImageFile(null);
    }
  }, [post]);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  const { mutate: updateMutate, isPending } = useMutation({
    mutationFn: updatePostApi,

    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUserBookmarks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
      onClose();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update post"
      );
    },
  });

  function handleUpdate() {
    updateMutate({
      postId: post?.id,
      content,
      imageFile,
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] transition-all transform scale-100">

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-500">
              <RxUpdate size={20} />
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              Edit Post
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="What's on your mind?"
            className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-gray-700 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all text-sm sm:text-base leading-relaxed"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-inner">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-80 w-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full bg-black/70 p-2.5 text-white hover:bg-black transition-colors shadow-lg backdrop-blur-md"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">

          {/* Change Photo */}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <FaImage className="text-sky-500" size={16} />

            <span>Change Photo</span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200/60 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={
                isPending ||
                (!content.trim() && !imagePreview)
              }
              className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

