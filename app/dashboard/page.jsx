"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [showDropDown, setShowDropDown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserAvatar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.firstName || user?.username}! 👋
                </h2>
                <p className="text-purple-100">
                  Manage your links and track your performance
                </p>
                <p className="text-purple-200 text-sm mt-1">
                  Member since {new Date(user?.createdAt).getFullYear()}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                        : user?.username[0].toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 relative">
            <svg
              className="w-5 h-5 absolute right-5 top-5 cursor-pointer"
              fill="currentColor"
              viewBox="0 0 24 24"
              onClick={() => setShowDropDown(!showDropDown)}
            >
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {showDropDown && (
              <div className="absolute right-5 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                <Link
                  href={`/profile/${user.username}/edit`}
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-900">@{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile Title</p>
                <p className="font-medium text-gray-900">
                  {user?.profile?.title || "Not set"}
                </p>
              </div>
            </div>
            {user?.bio && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-gray-900">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white p-6 rounded-xl shadow-sm border hover:border-purple-300 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div onClick={() => router.push(`/profile/${user.username}`)}>
                  <h4 className="font-medium text-gray-900">Add New Link</h4>
                  <p className="text-sm text-gray-500">Create a new link</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push(`/profile/${user.username}`)}
              className="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-300 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">View Profile</h4>
                  <p className="text-sm text-gray-500">@{user?.username}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                const profileUrl = `${window.location.origin}/profile/${user.username}`;
                navigator.clipboard.writeText(profileUrl);
                alert("Profile link copied to clipboard!");
              }}
              className="bg-white p-6 rounded-xl shadow-sm border hover:border-green-300 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Share Profile</h4>
                  <p className="text-sm text-gray-500">Copy profile link</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Links
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {user?.links?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.links?.length === 1 ? "link" : "links"} created
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Clicks
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {user?.links?.reduce(
                      (total, link) => total + (link.clicks || 0),
                      0
                    ) || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">across all links</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Member Since
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Date(user?.createdAt).getFullYear()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 9a2 2 0 002 2h6a2 2 0 002-2l-2-9"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Links</h3>
            {user?.links?.length > 0 && (
              <span className="text-sm text-gray-500">
                {user.links.length} {user.links.length === 1 ? "link" : "links"}
              </span>
            )}
          </div>

          {user?.links && user.links.length > 0 ? (
            <div className="space-y-4">
              {user.links.slice(0, 5).map((link) => (
                <div
                  key={link.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div
                    className="flex items-center justify-between"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate sm:w-full w-[14rem]">
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {link.clicks || 0}
                        </p>
                        <p className="text-xs text-gray-500">clicks</p>
                      </div>
                      <button className="text-gray-400 hover:text-purple-600 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {user.links.length > 5 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => router.push(`/profile/${user.username}`)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View all {user.links.length} links →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🔗</div>
              <p className="text-gray-500 mb-2">No links created yet</p>
              <p className="text-sm text-gray-400 mb-4">
                Start by adding your first link to share with others
              </p>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => router.push(`/profile/${user.username}`)}
              >
                Add Your First Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
