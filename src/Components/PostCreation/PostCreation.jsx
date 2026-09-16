import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaImage, FaPaperPlane, FaTimes } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

export default function PostCreation({ onClose }) {
  async function createPost(formData) {
    const token = localStorage.getItem("userToken");

    const response = await fetch(
      "https://route-posts.routemisr.com/posts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create post");
    }

    return data;
  }

  const { register, handleSubmit, watch, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState(null);

  const imageFiles = watch("image");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
    queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
    });

    queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
    });

    onClose();

    toast.success("Post created successfully!");
    },
    onError:()=>{
      toast.error("Post failed to be created!");
    }
  });

  useEffect(() => {
    if (imageFiles && imageFiles[0]) {
      const file = imageFiles[0];
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFiles]);

  function removeImage() {
    setValue("image", null);
    setImagePreview(null);
  }

  function handleCreatePost(values) {
    if (!values.body?.trim() && (!values.image || !values.image[0])) {
      return; 
    }

    const formData = new FormData();

    if (values.body?.trim()) {
      formData.append("body", values.body);
    }

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    mutate(formData);
  }

  const imageRegistration = register("image");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">
            Create Post
          </h2>

          <button 
            type="button" 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit(handleCreatePost)} className="p-6 overflow-y-auto flex-1">
          {/* Text Area */}
          <textarea
            {...register("body")}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 p-4 text-gray-700 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
          />

          {/* Image Preview Area */}
          {imagePreview && (
            <div className="relative mt-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-80 w-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 rounded-full bg-black/70 p-2.5 text-white hover:bg-black transition-colors shadow-lg"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          {/* Actions Footer Section inside the form */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FaImage className="text-sky-500" size={16} />
              <span>Add Photo</span>
              <input
                {...imageRegistration}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50 transition-all"
            >
              <FaPaperPlane size={14} />
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}