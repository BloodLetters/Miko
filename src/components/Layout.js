import React, {useState} from 'react';
import {Home, Search, History, Settings} from 'lucide-react';
import { useTheme } from '../utils/Theme';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import HistoryPage from './HistoryPage';
import ComicInfoPage from './ComicInfoPage';
import ReadComicPage from './ReadComicPage';
import SettingsPage from './SettingsPage';

const Layout = ({children}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('home');
    const [selectedManga, setSelectedManga] = useState(null);
    const [currentSource, setCurrentSource] = useState('');

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
        <div className={`h-screen flex flex-col ${
            theme === 'dark' 
                ? 'bg-gray-900 text-gray-100' 
                : 'bg-gray-100 text-gray-900'
        }`}>
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
                    <> 
                        {activeTab === 'home' && <HomePage onMangaSelect={handleMangaSelect}/>}
                        {activeTab === 'search' && <SearchPage onMangaSelect={handleMangaSelect}/>}
                        {activeTab === 'history' && <HistoryPage onMangaSelect={handleMangaSelect}/>}
                        {activeTab === 'settings' && <SettingsPage />}
                    </>
                )}
            </main>

            {!selectedManga && (
                <nav className={`fixed bottom-0 w-full ${
                    theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                } border-t`}>
                    <div className="flex justify-around items-center h-16">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center ${
                                activeTab === 'home'
                                    ? 'text-blue-500'
                                    : theme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                            }`}>
                            <Home size={24}/>
                            <span className="text-xs mt-1">Home</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex flex-col items-center ${
                                activeTab === 'search'
                                    ? 'text-blue-500'
                                    : theme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                            }`}>
                            <Search size={24}/>
                            <span className="text-xs mt-1">Search</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex flex-col items-center ${
                                activeTab === 'history'
                                    ? 'text-blue-500'
                                    : theme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                            }`}>
                            <History size={24}/>
                            <span className="text-xs mt-1">History</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex flex-col items-center ${
                                activeTab === 'settings'
                                    ? 'text-blue-500'
                                    : theme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                            }`}>
                            <Settings size={24}/>
                            <span className="text-xs mt-1">Settings</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;