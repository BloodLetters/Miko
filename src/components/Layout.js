import React, { useState, useEffect } from 'react';
import { Home, Search, History, ArrowLeft, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// Layout Component
const Layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedManga, setSelectedManga] = useState(null);
  const [currentSource, setCurrentSource] = useState('');

  const handleMangaSelect = (manga, source) => {
    setSelectedManga(manga);
    setCurrentSource(source);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      <main className="flex-1 overflow-y-auto pb-16">
        {selectedManga ? (
          <ComicInfoPage manga={selectedManga} source={currentSource} onBack={() => setSelectedManga(null)} />
        ) : (
          <>
            {activeTab === 'home' && <HomePage />}
            {activeTab === 'search' && <SearchPage onMangaSelect={handleMangaSelect} />}
            {activeTab === 'history' && <HistoryPage />}
          </>
        )}
      </main>

      {!selectedManga && (
        <nav className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700">
          <div className="flex justify-around items-center h-16">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center ${activeTab === 'search' ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <Search size={24} />
              <span className="text-xs mt-1">Search</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center ${activeTab === 'history' ? 'text-blue-400' : 'text-gray-400'}`}
            >
              <History size={24} />
              <span className="text-xs mt-1">History</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

const ReadComicPage = ({ chapter, source, onBack, chapterList }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    chapterList.findIndex(c => c.endpoint === chapter.endpoint)
  );

  useEffect(() => {
    const fetchChapterImages = async () => {
      setLoading(true);
      try {
        const cleanUrl = chapter.endpoint.replace(/^\/+/, "");
        const response = await fetch(
          `https://id-comic-api.vercel.app/api/${source}/${cleanUrl}`
        );
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

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = chapterList[currentChapterIndex - 1];
      setImages([]);
      setCurrentChapterIndex(currentChapterIndex - 1);
      setTimeout(() => {
        onBack(prevChapter);
      }, 0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapterList.length - 1) {
      const nextChapter = chapterList[currentChapterIndex + 1];
      setImages([]);
      setCurrentChapterIndex(currentChapterIndex + 1);
      setTimeout(() => {
        onBack(nextChapter);
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed top-0 left-0 right-0 bg-gray-900 z-50">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => onBack(null)}
            className="p-2 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h2 className="text-white text-sm truncate max-w-[200px]">
            {chapter.name}
          </h2>
          <div className="w-8" />
        </div>
      </div>

      <div className="pt-16 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {images.map((image, index) => (
              <div key={index} className="relative w-full">
                <img
                  src={`https://images.weserv.nl/?url=${encodeURIComponent(image)}`}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
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
            onClick={handleNextChapter}
            disabled={currentChapterIndex >= chapterList.length - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentChapterIndex >= chapterList.length - 1 
                ? 'bg-gray-700 text-gray-500' 
                : 'bg-blue-600 text-white'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <button
            onClick={handlePreviousChapter}
            disabled={currentChapterIndex <= 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentChapterIndex <= 0 
                ? 'bg-gray-700 text-gray-500' 
                : 'bg-blue-600 text-white'
            }`}
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Comic Info Page Component
const ComicInfoPage = ({ manga, source, onBack }) => {
  const [comicInfo, setComicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const fetchComicInfo = async () => {
      try {
        const cleanUrl = manga.manga_url.replace(/^\/+/, "");
        const response = await fetch(
          `https://id-comic-api.vercel.app/api/${source}/info/${cleanUrl}`
        );
        const data = await response.json();
        setComicInfo(data.data);
      } catch (error) {
        console.error('Error fetching comic info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComicInfo();
  }, [manga.manga_url, source]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (selectedChapter) {
    return (
      <ReadComicPage 
        chapter={selectedChapter}
        source={source}
        onBack={(chapter) => {
          if (chapter) {
            setSelectedChapter(chapter);
          } else {
            setSelectedChapter(null);
          }
        }}
        chapterList={comicInfo.chapter_list}
      />
    );
  }

  return (
    <div className="pb-4">
      {/* Banner */}
      <div className="relative h-48 w-full">
        <img 
          src={comicInfo?.cover || "/api/placeholder/800/400"} 
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-900/50 text-white"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Manga Info */}
      <div className="px-4 -mt-16 relative">
        <div className="flex gap-4">
          <img 
            src={comicInfo?.thumbnail || "/api/placeholder/150/200"} 
            alt={comicInfo?.title}
            className="w-32 h-44 object-cover rounded-lg shadow-lg"
          />
          <div className="flex-1 pt-16">
            <h1 className="text-xl font-bold">{comicInfo?.title}</h1>
          </div>
        </div>

        {/* Genres */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {comicInfo?.genre.map((genre, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-blue-400"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {comicInfo?.synopsis}
          </p>
        </div>

        {/* Chapter List */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Chapters</h2>
          <div className="space-y-2">
            {comicInfo?.chapter_list.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setSelectedChapter(chapter)}
                className="w-full p-3 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700"
              >
                <span className="text-sm">{chapter.name}</span>
                <Clock size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  const [newReleases] = useState([
    {
      title: "One Piece Chapter 1089",
      cover_image: "/api/placeholder/150/200",
      type: "Manga"
    },
    {
      title: "Jujutsu Kaisen Chapter 239",
      cover_image: "/api/placeholder/150/200",
      type: "Manga"
    },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">New Releases</h1>
      <div className="grid grid-cols-2 gap-4">
        {newReleases.map((manga, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
            <img 
              src={manga.cover_image} 
              alt={manga.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-2">
              <h3 className="font-medium text-sm">{manga.title}</h3>
              <p className="text-xs text-gray-400">{manga.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Page Component
const SearchPage = ({ onMangaSelect }) => {
  const [searchSource, setSearchSource] = useState('Komiku');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const cleanUrl = searchQuery.replace(/^\/+/, "")
      const response = await fetch(
        `https://id-comic-api.vercel.app/api/${searchSource}/search/manga/${cleanUrl}`
      );
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === "Go") {
      handleSearch(e);
    }
  };

  return (
    <div className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search manga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          // Ensures 'Enter' key on mobile triggers the search
          inputMode="search"
        />
        <Search className="absolute right-3 top-3 text-gray-400" size={20} />
      </div>

      <select
        value={searchSource}
        onChange={(e) => setSearchSource(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white"
      >
        <option value="Komiku">Komiku</option>
        <option value="Mangadex">Mangadex</option>
        <option value="Komikindo">Komikindo</option>
      </select>
    </form>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {searchResults.map((manga, index) => (
          <button
            key={index}
            onClick={() => onMangaSelect(manga, searchSource)}
            className="w-full bg-gray-800 rounded-lg shadow-md overflow-hidden flex text-left hover:bg-gray-700"
          >
            <img 
              src={manga.cover_image || "/api/placeholder/100/150"} 
              alt={manga.title}
              className="w-24 h-32 object-cover"
            />
            <div className="p-3 flex-1">
              <h3 className="font-medium text-sm">{manga.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{manga.type}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{manga.synopsis}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// History Page Component
const HistoryPage = () => {
  const [history] = useState([
    {
      title: "Recently Read Manga 1",
      lastRead: "Chapter 45",
      cover_image: "/api/placeholder/100/150"
    },
    {
      title: "Recently Read Manga 2",
      lastRead: "Chapter 23",
      cover_image: "/api/placeholder/100/150"
    },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reading History</h1>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex">
            <img 
              src={item.cover_image} 
              alt={item.title}
              className="w-24 h-32 object-cover"
            />
            <div className="p-3 flex-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">Last read: {item.lastRead}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;