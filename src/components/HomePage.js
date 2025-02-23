import React, { useState, useEffect } from 'react';
import { clearSearchResults } from '../utils/searchUtils';

const HomePage = ({ onMangaSelect }) => {
    const [popularComics, setPopularComics] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        clearSearchResults();

        // console.log(process.env.API_KEY);

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
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    return (
        <div>
            <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50">
                <div className="container mx-auto">
                    <h1 className="text-white text-xl font-bold">Home</h1>
                </div>
            </nav>

            <div className="pt-16 p-4">
                <h1 className="text-2xl font-bold mb-4">Popular Comics</h1>
                {Object.keys(popularComics).map((category) => (
                    <div key={category} className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">{category.replace(/_/g, ' ')}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {popularComics[category]?.map((manga, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleMangaClick(manga)}
                                    className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:bg-gray-700"
                                >
                                    <img src={manga.image} alt={manga.title} className="w-full h-48 object-cover" />
                                    <div className="p-3">
                                        <h3 className="font-medium text-sm text-white line-clamp-2">{manga.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{manga.genreReaders}</p>
                                        <p className="text-xs text-blue-400 mt-1">{manga.chapter}</p>
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