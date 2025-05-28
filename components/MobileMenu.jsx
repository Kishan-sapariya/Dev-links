"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import UserAvatar from "./UserAvatar";

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="md:hidden flex items-center justify-between space-x-4">
      <UserAvatar />
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-600 hover:text-purple-600"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block text-gray-600 hover:text-purple-600 px-3 py-2 text-base font-medium"
            >
              Features
            </a>
            {user ? (
              <Link
                href="/dashboard"
                className="block bg-purple-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-purple-700 mx-3 text-center"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-purple-600 hover:text-purple-700 px-3 py-2 text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block bg-purple-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-purple-700 mx-3 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
