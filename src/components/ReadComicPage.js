import React, {useState, useEffect} from 'react';
import {ArrowLeft, ChevronLeft, ChevronRight} from 'lucide-react';

const ReadComicPage = ({
    chapter,
    mangaInfoURL,
    source,
    manga,
    onBack,
    chapterList
}) => {
    const [images,
        setImages] = useState([]);
    const [loading,
        setLoading] = useState(true);
    const [currentChapterIndex,
        setCurrentChapterIndex] = useState(() => {
        const initialIndex = chapterList.findIndex(c => c.endpoint === chapter.endpoint);
        return initialIndex === -1
            ? 0
            : initialIndex;
    });
    const [localChapterList,
        setLocalChapterList] = useState(chapterList);

	// console.log(    chapter,
	// 	mangaInfoURL,
	// 	source,
	// 	manga,
	// 	onBack,
	// 	chapterList);

    useEffect(() => {
        setCurrentChapterIndex(prevIndex => {
            const newIndex = localChapterList.findIndex(c => c.endpoint === chapter.endpoint);
            return newIndex === -1
                ? 0
                : newIndex;
        });
    }, [chapter.endpoint, localChapterList]);

    useEffect(() => {
        setLocalChapterList(chapterList);
    }, [chapterList]);

    useEffect(() => {
        const fetchChapterImages = async() => {
            setLoading(true);
            try {
                const cleanUrl = chapter
                    .endpoint
                    .replace(/^\/+/, "");
                const response = await fetch(`https://id-comic-api.vercel.app/api/${source}/${cleanUrl}`);
                const data = await response.json();
                if (data.status === 200 && Array.isArray(data.data)) {
                    setImages(data.data);
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching chapter:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapterImages();
    }, [chapter, source]);

    useEffect(() => {
        saveToHistory(mangaInfoURL, manga, {
            title: chapter.title,
            thumbnail: chapter.thumbnail
        }, chapter, source);
    }, [chapter, source, mangaInfoURL, manga]);

    const saveToHistory = (mangaURL, manga, comicInfo, chapter, source) => {
        try {
            const history = JSON.parse(localStorage.getItem('readingHistory')) || [];
            const currentDate = new Date().toISOString();
            const formattedEndpoint = chapter
                .endpoint
                .replace(/^\/+/, "");

            const historyEntry = {
                title: manga
                    .title
                    .replace("Komik ", "") || 'Unknown Title',
                manga_url: mangaURL || '',
                lastReadChapter: {
                    name: chapter.name || 'Unknown Chapter',
                    endpoint: formattedEndpoint
                },
                source: source,
                cover: manga.thumbnail || "Unknown Thumbnail",
                thumbnail: manga.thumbnail || chapter.thumbnail,
                lastReadAt: currentDate,
                isFromHistory: true
            };

            const existingIndex = history.findIndex(item => item.title === historyEntry.title);

            if (existingIndex !== -1) {
                history[existingIndex] = {
                    ...history[existingIndex],
                    lastReadChapter: {
                        name: chapter.name || 'Unknown Chapter',
                        endpoint: formattedEndpoint
                    },
                    lastReadAt: currentDate
                };
            } else {
                history.unshift(historyEntry);
            }

            const trimmedHistory = history.slice(0, 50);
            localStorage.setItem('readingHistory', JSON.stringify(trimmedHistory));
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    };

    const handlePreviousChapter = () => {
        const currentChapterNumber = parseInt(chapter.name.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(currentChapterNumber)) {
            const prevChapterNumber = currentChapterNumber - 1;
            const prevChapter = localChapterList.find(c => parseInt(c.name.replace(/[^0-9]/g, ''), 10) === prevChapterNumber);

            if (prevChapter) {
                setImages([]);
                setCurrentChapterIndex(localChapterList.findIndex(c => c.endpoint === prevChapter.endpoint));
                onBack({
                    ...prevChapter,
                    manga_info: manga,
                    chapter_list: localChapterList,
                    manga_url: mangaInfoURL,
                    source: source
                });
            }
        }
    };

    const handleNextChapter = () => {
        const currentChapterNumber = parseInt(chapter.name.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(currentChapterNumber)) {
            const nextChapterNumber = currentChapterNumber + 1;
            const nextChapter = localChapterList.find(c => parseInt(c.name.replace(/[^0-9]/g, ''), 10) === nextChapterNumber);

            if (nextChapter) {
                setImages([]);
                setCurrentChapterIndex(localChapterList.findIndex(c => c.endpoint === nextChapter.endpoint));

                onBack({
                    ...nextChapter,
                    manga_info: manga,
                    chapter_list: localChapterList,
                    manga_url: mangaInfoURL,
                    source: source
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-black relative">
            <div className="fixed top-0 left-0 right-0 bg-gray-900 z-50">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => onBack(null)}
                        className="p-2 rounded-full hover:bg-gray-800">
                        <ArrowLeft size={24} className="text-white"/>
                    </button>
                    <h2 className="text-white text-sm truncate max-w-[200px]">
                        {chapter.name}
                    </h2>
                    <div className="w-8"/>
                </div>
            </div>

            <div className="pt-16 pb-20">
                {loading
                    ? (
                        <div className="flex justify-center items-center h-[80vh]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )
                    : (
                        <div className="space-y-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-full">
                                    <img
                                        src={`https://images.weserv.nl/?url=${encodeURIComponent(image)}`}
                                        alt={`Page ${index + 1}`}
                                        className="w-full h-auto"
                                        loading="lazy"/>
                                </div>
                            ))}
                            {images.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center h-[80vh] text-white">
                                    <p>No images found for this chapter</p>
                                    <p className="text-sm text-gray-400 mt-2">Chapter ID: {chapter.endpoint}</p>
                                </div>
                            )}
                        </div>
                    )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 z-50">
                <div className="flex justify-between items-center p-4">
                    <button
                        onClick={handlePreviousChapter}
                        disabled={!localChapterList.find(c => parseInt(c.name.replace(/[^0-9]/g, ''), 10) === (parseInt(chapter.name.replace(/[^0-9]/g, ''), 10) - 1))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${ !localChapterList.find(c => parseInt(c.name.replace(/[^0-9]/g, ''), 10) === (parseInt(chapter.name.replace(/[^0-9]/g, ''), 10) - 1))
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-blue-600 text-white'}`}>
                        <ChevronLeft size={20}/>
                        <span>Previous</span>
                    </button>

                    <button
                        onClick={handleNextChapter}
                        disabled={!localChapterList.find(c => parseInt(c.name.replace(/[^0-9]/g, ''), 10) === (parseInt(chapter.name.replace(/[^0-9]/g, ''), 10) + 1))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${ !localChapterList.find(c => parseInt(c.name.replace(/[^0-9]/g, ''), 10) === (parseInt(chapter.name.replace(/[^0-9]/g, ''), 10) + 1))
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-blue-600 text-white'}`}>
                        <span>Next</span>
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadComicPage;