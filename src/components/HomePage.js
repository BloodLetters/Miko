import React, { useState, useEffect } from 'react';
import { clearSearchResults } from '../utils/searchUtils';

const HomePage = ({ onMangaSelect }) => {
    const [popularComics, setPopularComics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clearSearchResults();
        const fetchPopularComics = async () => {
            try {
                const response = await fetch('https://id-comic-api.vercel.app/api/komiku/popular');
                const data = await response.json();
                setPopularComics(data.data || {});
            } catch (error) {
                console.error('Error fetching popular comics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularComics();
    }, []);

    const handleMangaClick = async (manga) => {
        setLoading(true);
        try {
            const response = await fetch(`https://id-comic-api.vercel.app/api/komiku/info${manga.link}`);
            const data = await response.json();

            if (data.data) {
                const mangaData = {
                    ...data.data,
                    title: manga.title,
                    thumbnail: manga.image,
                    manga_url: manga.link
                };
                onMangaSelect(mangaData, 'Komiku');
            }
        } catch (error) {
            console.error('Error fetching manga info:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-blue-500 text-xl">M</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <nav className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm z-50 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-white">Miko</h1>
                        {/* <div className="flex items-center space-x-2">
                            <div className="text-sm text-gray-400">
                                Your Favor
                            </div>
                        </div> */}
                    </div>
                </div>
            </nav>

            <div className="container mx-auto pt-20 px-4 pb-20">
                {Object.keys(popularComics).map((category) => (
                    <div key={category} className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white capitalize">
                                {category.replace(/_/g, ' ')}
                            </h2>
                            {/* <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                View All
                            </button> */}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {popularComics[category]?.map((manga, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleMangaClick(manga)}
                                    className="group relative flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-900/30 group-hover:bg-gray-900/0 transition-all duration-300"></div>
                                        <img
                                            src={manga.image}
                                            alt={manga.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = "/api/placeholder/100/150";
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-3">
                                            <h3 className="font-medium text-sm text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                                                {manga.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col justify-between bg-gray-800/95">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400 line-clamp-1">
                                                {manga.genreReaders}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                                                </svg>
                                                <span className="text-xs text-blue-400">
                                                    {manga.chapter}
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;