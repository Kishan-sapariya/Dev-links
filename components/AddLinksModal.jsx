"use client";

import { useState } from "react";

const AddLinksModal = ({ username, onClose, onLinkAdded }) => {
  const [links, setLinks] = useState([{ title: "", url: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addLinkField = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const removeLinkField = (index) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = links.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(updatedLinks);
  };

  const validateLinks = () => {
    const validLinks = links.filter(link => link.title.trim() && link.url.trim());
    
    if (validLinks.length === 0) {
      setError("Please add at least one link with both title and URL");
      return false;
    }

    // Basic URL validation
    for (const link of validLinks) {
      try {
        // Add protocol if missing
        const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
        new URL(url);
        link.url = url; // Update with proper protocol
      } catch {
        setError(`Invalid URL: ${link.url}`);
        return false;
      }
    }

    return validLinks;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const validLinks = validateLinks();
    if (!validLinks) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/profile/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          links: validLinks
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add links");
      }

      console.log("Links added successfully:", data);
      onLinkAdded();
    } catch (err) {
      console.error("Error adding links:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const popularPlatforms = [
    { name: "GitHub", url: "https://github.com/", icon: "🐙" },
    { name: "LinkedIn", url: "https://linkedin.com/in/", icon: "💼" },
    { name: "Twitter", url: "https://twitter.com/", icon: "🐦" },
    { name: "Instagram", url: "https://instagram.com/", icon: "📷" },
    { name: "YouTube", url: "https://youtube.com/@", icon: "📺" },
    { name: "Portfolio", url: "https://", icon: "🌐" },
  ];

  const addPlatformLink = (platform) => {
    const newLink = { title: platform.name, url: platform.url };
    setLinks([...links, newLink]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Add Links</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Add your social media and website links</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Add Popular Platforms */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Add</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {popularPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => addPlatformLink(platform)}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Links Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Your Links</h3>
              
              {links.map((link, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Link {index + 1}
                    </span>
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLinkField(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(index, "title", e.target.value)}
                        placeholder="e.g., My GitHub Profile"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, "url", e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Link Button */}
            <button
              type="button"
              onClick={addLinkField}
              className="w-full mb-6 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Another Link</span>
            </button>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Links"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLinksModal;
