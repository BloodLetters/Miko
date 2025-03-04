import React, {useState, useEffect} from 'react';
import {ArrowLeft, Clock} from 'lucide-react';
import { useTheme } from '../utils/Theme';
import ReadComicPage from './ReadComicPage';
import { getStoredSearchResults } from '../utils/searchUtils';

const ComicInfoPage = ({manga, source, onBack}) => {
    const { theme } = useTheme();
    const [comicInfo, setComicInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [latestChapter, setLatestChapter] = useState(null);
    const [mangaURL, setMangaURL] = useState(null);

    useEffect(() => {
        const { searchSource } = getStoredSearchResults();
        console.log(searchSource)
        const fetchComicInfo = async() => {
            try {
                const cleanUrl = manga.manga_url.replace(/^\/+/, "");
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

    // const saveToHistory = (chapter) => {
    //     // ... existing saveToHistory function
    // };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-screen ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    if (selectedChapter) {
        return (
            <ReadComicPage
                chapter={selectedChapter}
                mangaInfoURL={mangaURL}
                source={source}
                manga={comicInfo}
                onBack={(chapter) => {
                    if (chapter) {
                        setSelectedChapter(chapter);
                        // if (JSON.parse(localStorage.getItem('lastReadChapter.name') !== chapter.name)) {
                        //     saveToHistory(chapter);
                        // }
                    } else {
                        setSelectedChapter(null);
                    }
                }}
                chapterList={comicInfo.chapter_list}
            />
        );
    }

    return (
        <div className={`pb-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="relative h-48 w-full">
                <img
                    src={comicInfo?.cover || "/api/placeholder/800/400"}
                    alt="banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 p-2 rounded-full bg-gray-900/50 text-white hover:bg-gray-800/50">
                    <ArrowLeft size={24}/>
                </button>
            </div>

            <div className="px-4 -mt-16 relative">
                <div className="flex gap-4">
                    <img
                        src={comicInfo?.thumbnail || "/api/placeholder/150/200"}
                        alt={comicInfo?.title}
                        className="w-32 h-44 object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-1 pt-16">
                        <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {comicInfo?.title}
                        </h1>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Genres
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {comicInfo?.genre.map((genre, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 text-blue-400' 
                                        : 'bg-gray-200 text-blue-600'
                                } rounded-full text-sm`}>
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Synopsis
                    </h2>
                    <p className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {comicInfo?.synopsis}
                    </p>
                </div>

                <div className="mt-4 flex space-x-2">
                    <button
                        onClick={() => setSelectedChapter(comicInfo.chapter_list[comicInfo.chapter_list.length - 1])}
                        className={`flex-1 p-3 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-gray-700' 
                                : 'bg-white hover:bg-gray-50'
                        } rounded-lg flex items-center justify-center border ${
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Chapter 1
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedChapter(latestChapter)}
                        className={`flex-1 p-3 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-gray-700' 
                                : 'bg-white hover:bg-gray-50'
                        } rounded-lg flex items-center justify-center border ${
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Chapter {latestChapter?.name}
                        </span>
                    </button>
                </div>

                <div className="mt-4">
                    <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Chapters
                    </h2>
                    <div className="space-y-2">
                        {comicInfo?.chapter_list.map((chapter, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedChapter(chapter)}
                                className={`w-full p-3 ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 hover:bg-gray-700' 
                                        : 'bg-white hover:bg-gray-50'
                                } rounded-lg flex items-center justify-between border ${
                                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {chapter.name}
                                </span>
                                <Clock size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}/>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComicInfoPage;