// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const TagButton = () => {
  const initialSearchTags = [
    "Recipe",
    "Healthy",
    "Dessert",
    "Vegetarian",
    "Quick",
    "Easy",
    "Breakfast",
    "Lunch",
    "Dinner",
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [searchTags, setSearchTags] = useState(initialSearchTags.slice(0, 3));
  const [showAllTags, setShowAllTags] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchIconClick = () => {
    setShowOverlay(true);
  };

  const handleCancel = () => {
    setShowOverlay(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = () => {
    const results = initialSearchTags.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setShowOverlay(false);
    if (results.length > 0) {
      setSearchTags([
        ...results,
        ...initialSearchTags.filter((tag) => !results.includes(tag)),
      ]);
    }
  };

  const handleViewMore = () => {
    setShowAllTags(true);
    setSearchTags(initialSearchTags);
  };

  const handleMinimize = () => {
    setShowAllTags(false);
    setSearchTags(initialSearchTags.slice(0, 3));
  };
  return (
    <div className="flex flex-col w-full mt-5 items-center">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center">
          {searchResults.length > 0 ? (
            <div className="font-bold text-lg mt-2">
              {searchResults.length} result(s) found
            </div>
          ) : (
            <>
              {showAllTags ? (
                <button
                  onClick={handleMinimize}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md"
                >
                  Minimize
                </button>
              ) : (
                <button
                  onClick={handleViewMore}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md"
                >
                  All
                </button>
              )}
              <div className="mr-5">
                {searchTags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-block mr-2 py-2 px-2 border border-black"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center">
          {searchResults.length > 0 ? (
            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-red-500 text-white rounded-md"
            >
              Clear
            </button>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              onClick={handleSearchIconClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          )}
        </div>
      </div>
      {showOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-black w-40"
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md"
            >
              Search
            </button>
            <button
              onClick={handleCancel}
              className="ml-2 px-2 py-1 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagButton;
