import React, {useState, useEffect} from 'react';
import {ArrowLeft, Clock} from 'lucide-react';
import ReadComicPage from './ReadComicPage';
import { getStoredSearchResults } from '../utils/searchUtils';

const ComicInfoPage = ({manga, source, onBack}) => {
    const [comicInfo,
        setComicInfo] = useState(null);
    const [loading,
        setLoading] = useState(true);
    const [selectedChapter,
        setSelectedChapter] = useState(null);
    const [latestChapter,
        setLatestChapter] = useState(null);
    const [mangaURL,
        setMangaURL] = useState(null);

    useEffect(() => {
		const { searchSource } = getStoredSearchResults();
		console.log(searchSource)
        const fetchComicInfo = async() => {
            try {
                const cleanUrl = manga
                    .manga_url
                    .replace(/^\/+/, "");
				console.log(cleanUrl);
                const response = await fetch(`https://id-comic-api.vercel.app/api/${searchSource.toLowerCase()}/info/${cleanUrl}`);
                const data = await response.json();

                setComicInfo(data.data);
                setMangaURL(manga.manga_url)
                setLatestChapter(data.data.chapter_list[0]);
            } catch (error) {
                console.error('Error fetching comic info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComicInfo();
    }, [manga.manga_url, source]);

    const saveToHistory = (chapter) => {
        try {
            const history = JSON.parse(localStorage.getItem('readingHistory')) || [];
            const currentDate = new Date().toISOString();
            const formattedEndpoint = chapter
                .endpoint
                .replace(/^\/+/, "");

            const historyEntry = {
                title: comicInfo?.title
                        .replace("Komik ", "") || 'Unknown Title',
                manga_url: mangaURL || '',
                lastReadChapter: {
                    name: chapter.name || 'Unknown Chapter',
                    endpoint: formattedEndpoint
                },
                source: source,
                cover: comicInfo
                    ?.thumbnail || "Unknown Thumbnail",
                thumbnail: comicInfo
                    ?.thumbnail || chapter.thumbnail,
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    if (selectedChapter) {
        return (<ReadComicPage
            chapter={selectedChapter}
            mangaInfoURL={mangaURL}
            source={source}
            manga={comicInfo}
            onBack={(chapter) => {
            if (chapter) {
                setSelectedChapter(chapter);
                if (JSON.parse(localStorage.getItem('lastReadChapter.name') !== chapter.name)) {
                    saveToHistory(chapter);
                }
            } else {
                setSelectedChapter(null);
            }
        }}
            chapterList={comicInfo.chapter_list}/>);
    }

    return (
        <div className="pb-4">
            <div className="relative h-48 w-full">
                <img
                    src={comicInfo
                    ?.cover || "/api/placeholder/800/400"}
                    alt="banner"
                    className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 p-2 rounded-full bg-gray-900/50 text-white">
                    <ArrowLeft size={24}/>
                </button>
            </div>

            <div className="px-4 -mt-16 relative">
                <div className="flex gap-4">
                    <img
                        src={comicInfo
                        ?.thumbnail || "/api/placeholder/150/200"}
                        alt={comicInfo
                        ?.title}
                        className="w-32 h-44 object-cover rounded-lg shadow-lg"/>
                    <div className="flex-1 pt-16">
                        <h1 className="text-xl font-bold">{comicInfo
                                ?.title}</h1>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Genres</h2>
                    <div className="flex flex-wrap gap-2">
                        {comicInfo?.genre
                                .map((genre, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-800 rounded-full text-sm text-blue-400">
                                        {genre}
                                    </span>
                                ))}
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {comicInfo
                            ?.synopsis}
                    </p>
                </div>

                <div className="mt-4 flex space-x-2">
                    <button
                        onClick={() => setSelectedChapter(comicInfo.chapter_list[comicInfo.chapter_list.length - 1])}
                        className="flex-1 p-3 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700">
                        <span className="text-sm">Chapter 1</span>
                    </button>
                    <button
                        onClick={() => setSelectedChapter(latestChapter)}
                        className="flex-1 p-3 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700">
                        <span className="text-sm">Chapter {latestChapter?.name}</span>
                    </button>
                </div>

                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Chapters</h2>
                    <div className="space-y-2">
                        {comicInfo?.chapter_list.map((chapter, index) => (
							<button
								key={index}
								onClick={() => setSelectedChapter(chapter)}
								className="w-full p-3 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700">
								<span className="text-sm">{chapter.name}</span>
								<Clock size={16} className="text-gray-400"/>
							</button>
						))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComicInfoPage;