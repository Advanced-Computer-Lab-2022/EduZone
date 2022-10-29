import React from 'react';

const SearchBar = () => {
  return (
    <form className="w-full" action="/courses">
      {/*Search bar */}
      <div className="relative ">
        <input
          type="text"
          className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-gray-400"
          placeholder="Search"
          name="query"
        />
        <div className="absolute top-0 left-0 flex items-center h-full ml-3">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>

          <div className="relative">
            {/* <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div> */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
