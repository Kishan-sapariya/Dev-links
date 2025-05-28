"use client";

import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserAvatar = ({
  size = "md",
  showDropdown = true,
  showName = false,
  className = "",
  onClick = null,
}) => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Size configurations
  const sizeConfig = {
    xs: { avatar: "w-6 h-6", text: "text-xs", name: "text-xs" },
    sm: { avatar: "w-8 h-8", text: "text-sm", name: "text-sm" },
    md: { avatar: "w-10 h-10", text: "text-base", name: "text-sm" },
    lg: { avatar: "w-12 h-12", text: "text-lg", name: "text-base" },
    xl: { avatar: "w-16 h-16", text: "text-xl", name: "text-lg" },
  };

  const config = sizeConfig[size];

  const handleAvatarClick = () => {
    if (onClick) {
      onClick();
    } else if (showDropdown) {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (user) {
      router.push(`/profile/${user.username}`);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push(`/profile/${user.username}`);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".avatar-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (!user) {
    return (
      <button
        onClick={handleLoginClick}
        className={`${config.avatar} bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors ${className}`}
      >
        <svg
          className="w-1/2 h-1/2 text-gray-600"
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
      </button>
    );
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username[0].toUpperCase();
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <div className={`relative avatar-dropdown ${className}`}>
      {/* Rest of your existing JSX remains the same */}
      <div className="flex items-center space-x-2">
        {/* Avatar */}
        <button
          onClick={handleAvatarClick}
          className={`${config.avatar} rounded-full overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Profile"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <span className={`text-white font-bold ${config.text}`}>
                {getInitials()}
              </span>
            </div>
          )}
        </button>

        {/* Name (optional) */}
        {showName && (
          <div className="hidden sm:block">
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-800 font-medium">
              @{user.username}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          {/* Menu Items */}
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
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
            <span>View Profile</span>
          </button>

          <hr className="my-1" />

          <button
            onClick={() => router.push("/")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>

            <span>Home page</span>
          </button>

          <hr className="my-1" />

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
