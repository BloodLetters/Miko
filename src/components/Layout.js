import React, {useState} from 'react';
import {Home, Search, History} from 'lucide-react';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import HistoryPage from './HistoryPage';
import ComicInfoPage from './ComicInfoPage';
import ReadComicPage from './ReadComicPage';

const Layout = ({children}) => {
    const [activeTab,
        setActiveTab] = useState('home');
    const [selectedManga,
        setSelectedManga] = useState(null);
    const [currentSource,
        setCurrentSource] = useState('');

    const handleMangaSelect = (manga, source) => {
        if (manga.endpoint && manga.endpoint.includes('chapter')) {
            setSelectedManga({
                ...manga,
                isFromHistory: true
            });
        } else {
            setSelectedManga(manga);
        }
        setCurrentSource(source);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
            <main className="flex-1 overflow-y-auto pb-16">
                {selectedManga
                    ? (selectedManga.isFromHistory
                        ? (<ReadComicPage
                            chapter={selectedManga}
                            source={currentSource}
                            onBack={(chapter) => {
                            if (chapter) {
                                setSelectedManga({
                                    ...chapter,
                                    isFromHistory: true
                                });
                            } else {
                                setSelectedManga(null);
                            }
                        }}
                            chapterList={selectedManga.chapter_list || []}
                            manga={selectedManga.manga_info}
                            mangaInfoURL={selectedManga.manga_url}/>)
                        : (<ComicInfoPage
                            manga={selectedManga}
                            source={currentSource}
                            onBack={() => setSelectedManga(null)}/>))
                    : (
                    <> {
                        activeTab === 'home' && <HomePage onMangaSelect={handleMangaSelect}/>
                    }
                    {
                        activeTab === 'search' && <SearchPage onMangaSelect={handleMangaSelect}/>
                    }
                    {
                        activeTab === 'history' && <HistoryPage onMangaSelect={handleMangaSelect}/>
                    } </>
        )}
            </main>

            {!selectedManga && (
                <nav className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700">
                    <div className="flex justify-around items-center h-16">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center ${activeTab === 'home'
                            ? 'text-blue-400'
                            : 'text-gray-400'}`}>
                            <Home size={24}/>
                            <span className="text-xs mt-1">Home</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex flex-col items-center ${activeTab === 'search'
                            ? 'text-blue-400'
                            : 'text-gray-400'}`}>
                            <Search size={24}/>
                            <span className="text-xs mt-1">Search</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex flex-col items-center ${activeTab === 'history'
                            ? 'text-blue-400'
                            : 'text-gray-400'}`}>
                            <History size={24}/>
                            <span className="text-xs mt-1">History</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;