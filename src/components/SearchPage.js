import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Search} from 'lucide-react';
import {getStoredSearchResults} from '../utils/searchUtils';
import { useTheme } from '../utils/Theme';

const SearchPage = ({onMangaSelect}) => {
    const {theme} = useTheme();
    const {results, lastQuery, searchSource: initialSource, comicType: initialType} = getStoredSearchResults();

    const [searchSource,
        setSearchSource] = useState(initialSource);
    const [comicType,
        setComicType] = useState(initialType);
    const [searchQuery,
        setSearchQuery] = useState('');
    const [searchResults,
        setSearchResults] = useState(results);
    const [isLoading,
        setIsLoading] = useState(false);
    const [currentPage,
        setCurrentPage] = useState(1);
    const [maxPage,
        setMaxPage] = useState(null);
    const [hasMore,
        setHasMore] = useState(true);
    const [lastSearchQuery,
        setLastSearchQuery] = useState(lastQuery);

    const [tempSource,
        setTempSource] = useState(searchSource);
    const [tempType,
        setTempType] = useState(comicType);

    useEffect(() => {
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
        localStorage.setItem('lastSearchQuery', lastSearchQuery);
    }, [searchResults, lastSearchQuery]);

    const observer = useRef();
    const lastMangaElementRef = useCallback(node => {
        if (isLoading) 
            return;
        
        if (observer.current) 
            observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreResults();
            }
        });

        if (node) 
            observer.current.observe(node);
        }
    , [isLoading, hasMore]);

    const handleSearch = async(e) => {
        e.preventDefault();
        if (!searchQuery.trim()) 
            return;
        
        setSearchSource(tempSource);
        setComicType(tempType);
        localStorage.setItem('searchSource', tempSource);
        localStorage.setItem('comicType', tempType);

        setCurrentPage(1);
        setSearchResults([]);
        setMaxPage(null);
        setHasMore(true);
        setLastSearchQuery(searchQuery);

        await fetchResults(1, searchQuery, true);
    };

    const fetchResults = async(page, query, isNewSearch = false) => {
        setIsLoading(true);
        try {
            const cleanUrl = query.replace(/^\/+/, "");
            const endpoint = page === 1
                ? `https://id-comic-api.vercel.app/api/${tempSource}/search/${tempType.toLowerCase()}/${cleanUrl}`
                : `https://id-comic-api.vercel.app/api/${tempSource}/search/page/${page}/${tempType.toLowerCase()}/${cleanUrl}`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (data.status === 200) {
                setMaxPage(data.data.max_page);
                setSearchResults(prev => isNewSearch
                    ? data.data.results
                    : [
                        ...prev,
                        ...data.data.results
                    ]);
                setHasMore(page < data.data.max_page);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreResults = () => {
        if (currentPage < maxPage) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchResults(nextPage, lastSearchQuery);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === "Go") {
            handleSearch(e);
        }
    };

    return (
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search manga..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-3 rounded-lg border ${
                            theme === 'dark' 
                                ? 'border-gray-700 bg-gray-800 text-white' 
                                : 'border-gray-300 bg-white text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        inputMode="search"
                    />
                    <Search className={`absolute right-3 top-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} size={20}/>
                </div>

                <div className="flex gap-4">
                    <select
                        value={tempSource}
                        onChange={(e) => setTempSource(e.target.value)}
                        className={`flex-1 p-3 rounded-lg border ${
                            theme === 'dark'
                                ? 'border-gray-700 bg-gray-800 text-white'
                                : 'border-gray-300 bg-white text-gray-900'
                        }`}>
                        <option value="Komiku">Komiku</option>
                        <option value="Mangadex">Mangadex</option>
                        <option value="Komikindo">Komikindo</option>
                    </select>

                    <select
                        value={tempType}
                        onChange={(e) => setTempType(e.target.value)}
                        className={`flex-1 p-3 rounded-lg border ${
                            theme === 'dark'
                                ? 'border-gray-700 bg-gray-800 text-white'
                                : 'border-gray-300 bg-white text-gray-900'
                        }`}>
                        <option value="Manga">Manga</option>
                        <option value="Manhwa">Manhwa</option>
                        <option value="Manhua">Manhua</option>
                    </select>
                </div>
            </form>

            <div className="mt-6 space-y-4">
                {searchResults.map((manga, index) => {
                    const isLastElement = index === searchResults.length - 1;

                    return (
                        <button
                            key={index}
                            ref={isLastElement ? lastMangaElementRef : null}
                            onClick={() => onMangaSelect(manga, tempSource)}
                            className={`w-full ${
                                theme === 'dark'
                                    ? 'bg-gray-800 hover:bg-gray-700'
                                    : 'bg-white hover:bg-gray-50'
                            } rounded-lg shadow-md overflow-hidden flex text-left transition-colors duration-200 border ${
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                            <img
                                src={manga.cover_image || "/api/placeholder/100/150"}
                                alt={manga.title}
                                className="w-24 h-32 object-cover"
                            />
                            <div className="p-3 flex-1">
                                <h3 className={`font-medium text-sm ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {manga.title}
                                </h3>
                                <p className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                } mt-1`}>
                                    {manga.type}
                                </p>
                                <p className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                } mt-2 line-clamp-2`}>
                                    {manga.synopsis}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {isLoading && (
                <div className="flex justify-center items-center mt-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
            )}

            {!hasMore && searchResults.length > 0 && (
                <div className={`text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } mt-8`}>
                    <p>No more results available</p>
                </div>
            )}

            {searchResults.length === 0 && !isLoading && lastSearchQuery && (
                <div className={`text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } mt-8`}>
                    <p>No results found</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;