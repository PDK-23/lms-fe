import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearch } from "@/hooks/useSearch";
import { Input } from "../ui";

export default function SearchBox({ mobile = false }: { mobile?: boolean }) {
  const { t } = useTranslation();
  const {
    searchOpen,
    openSearch,
    searchQuery,
    setSearchQuery,
    searchRef,
    filteredCourses,
    submitSearch,
    onSubmit,
    onKeyDown,
  } = useSearch();

  if (mobile) {
    return (
      <form onSubmit={onSubmit} className="mb-3">
        <input
          ref={searchRef as any}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("header.searchPlaceholder")}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={t("header.search")}
        />
      </form>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={onSubmit} className="flex items-center">
        {/* <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder={placeholder}
            className="pl-10 pr-4"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div> */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => openSearch()}
            placeholder={t("header.searchPlaceholder")}
            className="border border-neutral-200 rounded-xl pl-10 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={t("header.search")}
          />
        </div>
      </form>

      {searchOpen && searchQuery && filteredCourses.length > 0 && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-neutral-200 rounded-md shadow-lg z-50 max-h-64 overflow-auto">
          <ul>
            {filteredCourses.map((c) => (
              <li key={c.id} className="border-b last:border-b-0">
                <button
                  onClick={() => submitSearch(c.title)}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center gap-3"
                >
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div>
                    <div className="text-sm font-medium text-neutral-800">
                      {c.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {c.category.name}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
