import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    FiCalendar,
    FiCamera,
    FiEdit3,
    FiUser,
    FiX,
    FiPlus,
    FiGrid,
    FiBookmark
} from "react-icons/fi";
import axios from "axios";
import { getUserProfile } from "../../Api/getUserProfile.api";
import { updateUserProfile } from "../../Api/updateUserProfile.api";
import CardPost from "../CardPost/CardPost";
import Loading from "../Loading/Loading";
import PostCreation from "../PostCreation/PostCreation";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";
import { Dropdown } from "@heroui/react";
import { FaImages } from "react-icons/fa6";

const getUserPosts = async (userId) => {
    const token = localStorage.getItem("userToken");

    const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};

const getUserBookmarks = async () => {
    const token = localStorage.getItem("userToken");

    const res = await axios.get(
        `https://route-posts.routemisr.com/users/bookmarks`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data;
};

function ErrorState({ message, onRetry }) {
    return (
        <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-gray-800">
                Unable to load this profile
            </p>
            <p className="mt-2 text-sm text-gray-500">
                {message || "Something went wrong."}
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-100 hover:bg-sky-600 transition"
            >
                Try again
            </button>
        </div>
    );
}

function EditProfilePhotoModal({ user, onClose }) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
    } = useForm();

    const selectedPhoto = watch("photo");
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!selectedPhoto?.[0]) {
            setPreviewUrl(null);
            return undefined;
        }

        const objectUrl = URL.createObjectURL(selectedPhoto[0]);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedPhoto]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateUserProfile,

        onSuccess: () => {
            toast.success("Profile photo updated successfully!");

            queryClient.invalidateQueries({
                queryKey: ["getUserProfile"],
            });

            onClose();
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                "Could not update profile photo"
            );
        },
    });

    function submitPhoto(values) {
        if (!values.photo?.[0]) {
            toast.error("Please select a photo");
            return;
        }

        const formData = new FormData();
        formData.append("photo", values.photo[0]);

        mutate(formData);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        Update Profile Photo
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(submitPhoto)}
                    className="space-y-5 p-6"
                >
                    {/* Current / Preview */}
                    <div className="flex justify-center">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-32 w-32 rounded-full object-cover ring-4 ring-sky-100"
                            />
                        ) : user?.photo ? (
                            <img
                                src={user.photo}
                                alt={user.name || "Profile"}
                                className="h-32 w-32 rounded-full object-cover ring-4 ring-sky-100"
                            />
                        ) : (
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-sky-100 text-4xl font-bold text-sky-600">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                    </div>

                    {/* File Input */}
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center transition hover:border-sky-400 hover:bg-sky-50">
                        <FiCamera className="text-2xl text-sky-500" />
                        <span className="text-sm font-semibold text-gray-700">
                            Choose a new profile photo
                        </span>
                        <span className="text-xs text-gray-400">
                            JPG, PNG or other image formats
                        </span>
                        <input
                            {...register("photo")}
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                    </label>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-100 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? "Uploading..." : "Update Photo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Profile() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");

    // Get current user's profile
    const profileQuery = useQuery({
        queryKey: ["getUserProfile"],
        queryFn: getUserProfile,
        select: (response) => response?.data?.data?.user
    });

    const user = profileQuery.data;

    // Get current user's posts
    const postsQuery = useQuery({
        queryKey: ["getUserPosts", user?._id],
        queryFn: () => getUserPosts(user?._id),
        enabled: Boolean(user?._id),
        select: (response) =>
            response?.posts ||
            response?.data?.posts ||
            []
    });

    // Get current user's bookmarks
    const bookmarksQuery = useQuery({
        queryKey: ["getUserBookmarks"],
        queryFn: getUserBookmarks,
        enabled: Boolean(user?._id),
        select: (response) =>
            response?.data?.bookmarks ||
            []
    });

    const posts = postsQuery.data || [];
    const bookmarks = bookmarksQuery.data || [];

    // Profile loading
    if (profileQuery.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
                <Loading />
            </div>
        );
    }

    // Profile error
    if (profileQuery.isError || !user) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="mx-auto max-w-lg">
                    <ErrorState
                        message={profileQuery.error?.message}
                        onRetry={profileQuery.refetch}
                    />
                </div>
            </main>
        );
    }

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric"
            }
        )
        : null;

    return (
        <>
            <title>
                {user.name || "Profile"} | Linky
            </title>

            <main className="min-h-screen bg-gray-50/60 pb-16 pt-6">
                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 space-y-6">
                    {/* Profile Header Card */}
                    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                        {/* Cover Photo */}
                        <div className="h-44 sm:h-60 w-full bg-gradient-to-r from-sky-400 to-sky-200 relative overflow-hidden">
                            {user.cover && (
                                <img
                                    src={user.cover}
                                    alt="Profile cover"
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-9">
                            <div className="-mt-16 sm:-mt-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                                            >
                                                {user?.photo ? (
                                                    <img
                                                        src={user.photo}
                                                        alt={user.name || "Profile"}
                                                        className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover shadow-md ring-4 ring-white cursor-pointer transition hover:opacity-90"
                                                    />
                                                ) : (
                                                    <div className="h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center rounded-full bg-sky-100 text-3xl font-bold text-sky-600 shadow-md ring-4 ring-white cursor-pointer transition hover:bg-sky-200">
                                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                )}
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Popover className="min-w-[180px] border border-gray-100 bg-white p-1.5 shadow-xl">
                                            <Dropdown.Menu className="text-sm font-medium">
                                                <Dropdown.Item
                                                    key="update-photo"
                                                    textValue="Update Photo"
                                                    onClick={() => setShowEditModal(true)}
                                                    className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-gray-700 outline-none transition hover:bg-sky-100 focus:bg-sky-100"
                                                >
                                                    <FaImages className="text-sky-500" />
                                                    <span>Update Photo</span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown>

                                    {/* Name */}
                                    <div className="min-w-0 pb-1">
                                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                                            {user.name || "User"}
                                        </h1>
                                        <p className="text-sm font-medium text-sky-500">
                                            @{user.username || "user"}
                                        </p>
                                    </div>
                                </div>

                                {/* Edit Profile */}
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition"
                                >
                                    <FiEdit3
                                        size={16}
                                        className="text-sky-500"
                                    />
                                    Edit profile
                                </button>
                            </div>

                            {/* Bio */}
                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600">
                                {user.bio ||
                                    "Share your thoughts and connect with your community on Linky."}
                            </p>

                            {/* Stats */}
                            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-5 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 text-base">
                                        {user.followersCount ||
                                            user.followers?.length ||
                                            0}
                                    </span>
                                    <span className="text-gray-500">
                                        Followers
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 text-base">
                                        {user.followingCount ||
                                            user.following?.length ||
                                            0}
                                    </span>
                                    <span className="text-gray-500">
                                        Following
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 text-base">
                                        {posts.length}
                                    </span>
                                    <span className="text-gray-500">
                                        Posts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <FiUser
                                className="text-sky-500"
                                size={18}
                            />
                            About
                        </h2>

                        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                            {/* Username */}
                            <div className="flex items-center gap-3.5 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
                                <div className="p-2.5 rounded-xl bg-white text-sky-500 shadow-sm">
                                    <FiUser size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Username
                                    </span>
                                    <span className="font-bold text-gray-800">
                                        @{user.username || "user"}
                                    </span>
                                </div>
                            </div>

                            {/* Joined Date */}
                            {joinedDate && (
                                <div className="flex items-center gap-3.5 rounded-2xl bg-gray-50/60 p-4 border border-gray-100">
                                    <div className="p-2.5 rounded-xl bg-white text-sky-500 shadow-sm">
                                        <FiCalendar size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Joined Date
                                        </span>
                                        <span className="font-bold text-gray-800">
                                            {joinedDate}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Follow Suggestions */}
                    <FollowSuggestions />

                    {/* Tabs / Switcher Header */}
                    <div className="flex items-center justify-between bg-white rounded-3xl border border-gray-100 px-6 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab("posts")}
                                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                                    activeTab === "posts"
                                        ? "bg-sky-500 text-white shadow-md shadow-sky-100"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <FiGrid size={16} />
                                My Posts ({posts.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("bookmarks")}
                                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                                    activeTab === "bookmarks"
                                        ? "bg-sky-500 text-white shadow-md shadow-sky-100"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <FiBookmark size={16} />
                                Saved Bookmarks ({bookmarks.length})
                            </button>
                        </div>

                        {activeTab === "posts" && (
                            <button
                                type="button"
                                onClick={() => setShowPostModal(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-100 hover:bg-sky-600 transition"
                            >
                                <FiPlus size={16} />
                                Create Post
                            </button>
                        )}
                    </div>

                    {/* Posts Tab Content */}
                    {activeTab === "posts" && (
                        <section className="space-y-4">
                            {postsQuery.isLoading && (
                                <div className="flex justify-center py-12">
                                    <Loading />
                                </div>
                            )}

                            {postsQuery.isError && (
                                <ErrorState
                                    message="Unable to load this user's posts."
                                    onRetry={postsQuery.refetch}
                                />
                            )}

                            {!postsQuery.isLoading && !postsQuery.isError && (
                                posts.length ? (
                                    <div className="flex flex-col gap-4">
                                        {posts.map((post) => (
                                            <CardPost
                                                key={post._id || post.id}
                                                post={post}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                                        <p className="font-bold text-gray-700 text-base">
                                            No posts yet
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            When you share something, it will show up right here.
                                        </p>
                                    </div>
                                )
                            )}
                        </section>
                    )}

                    {/* Bookmarks Tab Content */}
                    {activeTab === "bookmarks" && (
                        <section className="space-y-4">
                            {bookmarksQuery.isLoading && (
                                <div className="flex justify-center py-12">
                                    <Loading />
                                </div>
                            )}

                            {bookmarksQuery.isError && (
                                <ErrorState
                                    message="Unable to load bookmarks."
                                    onRetry={bookmarksQuery.refetch}
                                />
                            )}

                            {!bookmarksQuery.isLoading && !bookmarksQuery.isError && (
                                bookmarks.length ? (
                                    <div className="flex flex-col gap-4">
                                        {bookmarks.map((post) => (
                                            <CardPost
                                                key={post._id || post.id}
                                                post={post}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                                        <p className="font-bold text-gray-700 text-base">
                                            No bookmarks yet
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            Posts you save will appear here.
                                        </p>
                                    </div>
                                )
                            )}
                        </section>
                    )}
                </div>
            </main>

            {/* Edit Photo Modal */}
            {showEditModal && (
                <EditProfilePhotoModal
                    user={user}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {/* Create Post Modal */}
            {showPostModal && (
                <PostCreation
                    isOpen={showPostModal}
                    onClose={() => setShowPostModal(false)}
                />
            )}
        </>
    );
}