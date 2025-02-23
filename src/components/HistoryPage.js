import React, {useState, useEffect} from 'react';
import { clearSearchResults } from '../utils/searchUtils';

const HistoryPage = ({onMangaSelect}) => {
    const [history,
        setHistory] = useState([]);
    const [loading,
        setLoading] = useState(false);

    useEffect(() => {
        clearSearchResults();
        try {
            const storedHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
            const sortedHistory = storedHistory.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
            setHistory(sortedHistory);
        } catch (error) {
            console.error('Error loading history:', error);
            setHistory([]);
        }
    }, []);

    const handleMangaClick = async(historyItem) => {
        setLoading(true);
        try {
            const cleanUrl = historyItem
                .manga_url
                .replace(/^\/+/, "");
            const response = await fetch(`https://id-comic-api.vercel.app/api/${historyItem.source}/info/${cleanUrl}`);
            const data = await response.json();

            if (data.data) {
                const chapterData = {
                    ...historyItem.lastReadChapter,
                    title: historyItem.title,
                    thumbnail: historyItem.cover || historyItem.thumbnail,
                    isFromHistory: true,
                    endpoint: historyItem.lastReadChapter.endpoint,
                    manga_info: data.data,
                    chapter_list: data.data.chapter_list || []
                };
                onMangaSelect(chapterData, historyItem.source);
            }
        } catch (error) {
            console.error('Error fetching manga info:', error);
            const chapterData = {
                ...historyItem.lastReadChapter,
                title: historyItem.title,
                thumbnail: historyItem.cover || historyItem.thumbnail,
                isFromHistory: true,
                endpoint: historyItem.lastReadChapter.endpoint,
                chapter_list: []
            };
            onMangaSelect(chapterData, historyItem.source);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            return 'Unknown date';
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reading History</h1>
            {history.length === 0
                ? (
                    <div className="text-center text-gray-400 mt-8">
                        <p>No reading history yet</p>
                    </div>
                )
                : (
                    <div className="space-y-4">
                        {history.map((item, index) => (
                            <button
                                key={`${item.title}-${index}`}
                                onClick={() => handleMangaClick(item)}
                                disabled={loading}
                                className={`w-full bg-gray-800 rounded-lg shadow-md overflow-hidden flex text-left ${loading
                                ? 'opacity-50 cursor-wait'
                                : 'hover:bg-gray-700'} transition duration-200 ease-in-out`}>
                                <div className="relative w-24 h-32">
                                    <img
                                        src={item.cover || item.thumbnail || "/api/placeholder/100/150"}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                        e.target.src = "/api/placeholder/100/150";
                                    }}/>
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-2 py-1">
                                        <span className="text-xs text-white">{item.source}</span>
                                    </div>
                                </div>
                                <div className="p-3 flex-1">
                                    <h3 className="font-medium text-sm text-white line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-blue-400 mt-1">
                                        {item.lastReadChapter.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(item.lastReadAt)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
        </div>
    );
};

export default HistoryPage;