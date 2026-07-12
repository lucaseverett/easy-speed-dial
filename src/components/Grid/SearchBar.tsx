import { observer } from "mobx-react-lite";

import { search } from "#stores/search";

export const SearchBar = observer(function SearchBar() {
  return (
    <div className="SearchBar">
      <div className="search-field">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14Z"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search bookmarks"
          aria-label="Search bookmarks"
          autoComplete="off"
          spellCheck={false}
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && search.query) {
              e.preventDefault();
              e.stopPropagation();
              search.clear();
            }
          }}
        />
        {search.query && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => search.clear()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});
