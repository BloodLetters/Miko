// searchUtils.js
export const clearSearchResults = () => {
    localStorage.removeItem('searchResults');
    localStorage.removeItem('lastSearchQuery');
    localStorage.removeItem('searchSource');
    localStorage.removeItem('comicType');
    return true;
};

export const getStoredSearchResults = () => {
    const results = localStorage.getItem('searchResults');
    const query = localStorage.getItem('lastSearchQuery');
    const source = localStorage.getItem('searchSource');
    const type = localStorage.getItem('comicType');

    return {
        results: results ? JSON.parse(results) : [],
        lastQuery: query || '',
        searchSource: source || 'Komiku',
        comicType: type || 'Manga'
    };
};