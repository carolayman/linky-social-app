import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    FiArrowUpRight,
    FiRefreshCw,
    FiUsers
} from "react-icons/fi";
import { getFollowSuggestions } from "../../Api/getFollowSuggestions.api";

function getSuggestions(response) {
    const payload = response?.data;

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.users)) return payload.users;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.users)) return payload.data.users;

    return [];
}

function UserAvatar({ user }) {
    const name = user?.name || user?.username || "User";

    if (user?.photo) {
        return (
            <img
                src={user.photo}
                alt={name}
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-4 ring-sky-50"
            />
        );
    }

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600 ring-4 ring-sky-50">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

function SuggestionSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-28 rounded bg-gray-200" />
                <div className="h-2.5 w-20 rounded bg-gray-100" />
            </div>

            <div className="h-9 w-20 rounded-xl bg-gray-200" />
        </div>
    );
}

export default function FollowSuggestions() {
    const {
        data: suggestions = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["followSuggestions"],
        queryFn: getFollowSuggestions,
        select: getSuggestions,
    });

    return (
        <section className="w-full rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

                <div>
                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                            <FiUsers size={18} />
                        </div>

                        <h2 className="text-base font-bold text-gray-800">
                            People you may know
                        </h2>

                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        Discover new people and grow your circle on Linky.
                    </p>
                </div>

            </div>

            {/* Content */}
            <div className="mt-6">

                {/* Loading */}
                {isLoading && (
                    <div className="grid gap-4 sm:grid-cols-2">

                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />
                        <SuggestionSkeleton />

                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="rounded-2xl border border-red-100 bg-red-50/60 px-5 py-4">

                        <p className="text-sm font-medium text-red-600">
                            Suggestions could not be loaded.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-2 text-sm font-semibold text-red-600 underline underline-offset-2 hover:text-red-700"
                        >
                            Try again
                        </button>

                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && suggestions.length === 0 && (
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-5 py-8 text-center">

                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                            <FiUsers size={19} />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-700">
                            No new suggestions
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Check back later for more people to connect with.
                        </p>

                    </div>
                )}

                {/* Suggestions */}
                {!isLoading && !isError && suggestions.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">

                        {suggestions.slice(0, 6).map((user) => {

                            const name =
                                user?.name ||
                                user?.username ||
                                "User";

                            const username = user?.username
                                ? `@${user.username}`
                                : "Suggested for you";

                            return (
                                <div
                                    key={
                                        user?._id ||
                                        user?.id ||
                                        name
                                    }
                                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 transition hover:border-sky-100 hover:bg-sky-50/30"
                                >

                                    {/* Avatar */}
                                    <UserAvatar user={user} />

                                    {/* User Info */}
                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm font-bold text-gray-800">
                                            {name}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-gray-400">
                                            {username}
                                        </p>

                                    </div>

                                    {/* Profile Button */}
                                    <Link
                                        to="/profile"
                                        aria-label={`View ${name}'s profile`}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-500"
                                    >
                                        <FiArrowUpRight size={16} />
                                    </Link>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* Explore Button */}
            {!isLoading && !isError && suggestions.length > 0 && (
                <Link
                    to="/profile"
                    className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                    Explore profiles
                    <FiArrowUpRight size={16} />
                </Link>
            )}

        </section>
    );
}