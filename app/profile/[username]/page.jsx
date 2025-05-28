"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import AddLinksModal from "@/components/AddLinksModal";
import Link from "next/link";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import useProfileStore from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";

const ProfilePage = () => {
  const { user, loading, error, fetchProfile } = useProfileStore();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [showAddLinksModal, setShowAddLinksModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const router = useRouter();
  const params = useParams();
  const username = params.username;

  const isOwner = isAuthenticated && currentUser?.username === username;
  useEffect(() => {
    if (username) {
      fetchProfile(username);
    }
  }, [username, fetchProfile]);

  const handleLinkAdded = () => {
    fetchProfile(username);
    setShowAddLinksModal(false);
  };

  const handleLinkClick = async (linkId, url) => {
    try {
      await fetch(`/api/profile/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkId }),
      });

      window.open(url, "_blank");
      fetchProfile();
    } catch (error) {
      console.error("Error tracking click:", error);
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return <Loading username={username} />;
  }

  if (error) {
    return <Error username={username} error={error} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-6 relative">
          {isOwner && (
            <svg
              className="w-5 h-5 absolute right-5 top-5 cursor-pointer"
              fill="currentColor"
              viewBox="0 0 24 24"
              onClick={() => setShowDropDown(!showDropDown)}
            >
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          )}
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

          {/* Profile Image */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-purple-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center border-4 border-purple-200">
                <span className="text-white text-2xl font-bold">
                  {user.firstName && user.lastName
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : user.username[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username}
          </h1>
          <p className="text-gray-600 mb-1">@{user.username}</p>
          {isOwner && <p className="text-sm text-gray-500">{user.email}</p>}

          {/* Profile Title */}
          {user.profile?.title && (
            <p className="text-sm font-medium text-purple-600 mb-2 mt-3">
              {user.profile.title}
            </p>
          )}

          {/* Bio or Profile Description */}
          {(user.bio || user.profile?.description) && (
            <p className="text-sm text-gray-500 mt-3">
              {user.bio || user.profile.description}
            </p>
          )}
        </div>

        {/* Add Links Button */}
        {isOwner && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddLinksModal(true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add Links</span>
            </button>
          </div>
        )}

        {/* Links Section */}
        {user.links && user.links.length > 0 ? (
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 text-center mb-6">
              {isOwner ? "My Links" : "Total Links"} ({user.links.length})
            </h2>

            {user.links.map((link) => (
              <div
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-purple-600"
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-left">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate text-left sm:w-[20rem] w-[16rem]">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-gray-400 mb-1">
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
                    </div>
                    <span className="text-xs text-gray-400">
                      {link.clicks} clicks
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-6">
            <div className="text-gray-400 text-6xl mb-4">🔗</div>
            <p className="text-gray-500 mb-2">No links added yet</p>
            <p className="text-sm text-gray-400">
              Click "Add Links" to get started!
            </p>
          </div>
        )}

        {/* Share Profile Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Profile link copied to clipboard!");
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            Share Profile
          </button>
        </div>

        {/* Stats */}
        {isOwner && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {user.links?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Links</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {user.links?.reduce(
                    (total, link) => total + link.clicks,
                    0
                  ) || 0}
                </p>
                <p className="text-sm text-gray-600">Total Clicks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {new Date(user.createdAt).getFullYear()}
                </p>
                <p className="text-sm text-gray-600">Member Since</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Links Modal */}
      {showAddLinksModal && (
        <AddLinksModal
          username={username}
          onClose={() => setShowAddLinksModal(false)}
          onLinkAdded={handleLinkAdded}
        />
      )}
    </div>
  );
};

export default ProfilePage;
