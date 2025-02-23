export const clearSearchResults = () => {
    localStorage.removeItem('searchResults');
    localStorage.removeItem('lastSearchQuery');
    localStorage.removeItem('searchSource');
    localStorage.removeItem('comicType');
    localStorage.removeItem('authenticated');
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
        searchSource: source || 'komiku',
        comicType: type || 'Manga'
    };
};