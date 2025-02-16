import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Search, History } from 'lucide-react';
import SearchHelper from "./Component/SearchHelper";

const proxyUrl = "https://thingproxy.freeboard.io/fetch/";

const ComicInfoPage = ({ comicInfo, onBackClick, onChapterClick }) => {
  if (!comicInfo) {
    return <div className="p-4 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="pb-20 bg-gray-900 text-gray-100">
      <div className="relative mb-4">
        <img src={comicInfo.thumbnail} alt="banner" className="w-full h-48 object-cover" />
        <button 
          onClick={onBackClick}
          className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-4">
        <div className="flex gap-4 mb-4">
          <img src={comicInfo.thumbnail} alt={comicInfo.title} className="w-32 h-48 object-cover rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold mb-2">{comicInfo.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              {comicInfo.genre?.map((genre, index) => (
                <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Synopsis</h2>
          <p className="text-gray-300">{comicInfo.synopsis || "No synopsis available."}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Chapters</h2>
          <div className="space-y-2">
            {comicInfo.chapter_list?.map((chapter, index) => (
              <button
                key={index}
                onClick={() => onChapterClick(comicInfo.title, chapter.endpoint)}
                className="w-full p-3 bg-gray-800 rounded-lg hover:bg-gray-700 text-left"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{chapter.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollableList = ({ title, items, onComicClick }) => {
  const scrollLeft = (id) => {
    document.getElementById(id).scrollLeft -= 200;
  };

  const scrollRight = (id) => {
    document.getElementById(id).scrollLeft += 200;
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollLeft(title)}
            className="p-1 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button 
            onClick={() => scrollRight(title)}
            className="p-1 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
      <div 
        id={title}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 px-4 pb-4"
      >
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex-none w-32 md:w-40"
            onClick={() => onComicClick(item.link)}
          >
            <div className="relative group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                style={{ aspectRatio: '160/220' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-gray-300 text-xs">Ch. {item.chapter}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const HomePage = ({ onComicClick }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="p-4 bg-gray-800">
        <h1 className="text-xl font-bold text-white">Manga Reader</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <section className="mb-6">
          <div className="py-4">
            <h2 className="text-lg font-semibold text-white mb-4">Popular Manga</h2>
            <SearchHelper 
              fetchType="manga"
              onComicClick={onComicClick}
            />

            <h2 className="text-lg font-semibold text-white mb-4">Popular Manhwa</h2>
            <SearchHelper 
              fetchType="manhwa"
              onComicClick={onComicClick}
            />

            <h2 className="text-lg font-semibold text-white mb-4">Popular Manhua</h2>
            <SearchHelper 
              fetchType="manhua"
              onComicClick={onComicClick}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const SearchPage = ({ onComicClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setIsLoading(true);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="p-4 sticky top-0 bg-gray-900 z-10">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manga..."
            className="w-full p-4 pl-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <>
            {isLoading && (
              <div className="p-4 text-center text-gray-400">
                <p>Searching for "{searchQuery}"...</p>
              </div>
            )}
            <SearchHelper 
              searchTerm={searchQuery}
              onLoadComplete={() => setIsLoading(false)}
              onComicClick={onComicClick}
              fetchType="search"
            />
          </>
        ) : (
          <div className="p-4 text-center text-gray-400">
            <p>Type a manga title and press Enter to search</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryPage = ({ onComicClick }) => {
  return (
    <div className="h-screen bg-gray-900 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Reading History</h2>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex bg-gray-800 rounded-lg p-2">
            <img
              src={`/api/placeholder/60/80`}
              alt={`Manga ${item}`}
              className="w-16 h-20 rounded"
            />
            <div className="ml-3 flex-1">
              <h3 className="text-white font-medium">Manga Title {item}</h3>
              <p className="text-gray-400 text-sm">Read up to Chapter 45</p>
              <div className="w-full bg-gray-700 h-1 rounded mt-2">
                <div className="bg-blue-500 h-1 rounded" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MangaReader = ({ comicSlug, chapter, onBackClick, onNextChapter, onPreviousChapter }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const response = await fetch(proxyUrl + `https://komiku.id${chapter}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const pageElements = doc.querySelectorAll("img[itemprop='image']");
        const pages = Array.from(pageElements).map((img, index) => ({
          id: index + 1,
          url: img.src || img.getAttribute("onerror").match(/this\.src='([^']+)'/)[1]
        }));

        setPages(pages);
      } catch (error) {
        console.error("Error loading pages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, [comicSlug, chapter]);

  const parts = chapter.split("/");
  const fixedChapterName = parts[parts.length - 2].split("-").pop();

  return (
    <div className="bg-gray-900 text-gray-100">
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 p-4">
        <div className="flex items-center gap-4">
          <button onClick={onBackClick}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Chapter {fixedChapterName}</h1>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <div key={page.id} className="flex justify-center">
                <img
                  src={page.url}
                  alt={`Page ${page.id}`}
                  className="max-w-full h-auto"
                />
              </div>
            ))}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-between">
              <button
                onClick={onPreviousChapter}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={onNextChapter}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedComic, setSelectedComic] = useState(null);
  const [readingChapter, setReadingChapter] = useState(null);
  const [comicInfo, setComicInfo] = useState(null);

  const fetchComicInfo = async (comicSlug) => {
    try {
      const response = await fetch(`https://komiku-api.fly.dev/api/comic/info${comicSlug}`);
      const data = await response.json();
      if (data.success) {
        setComicInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching comic info:", error);
    }
  };

  const handleComicClick = async (comicSlug) => {
    await fetchComicInfo(comicSlug);
    setCurrentPage('comic-info');
  };

  const handleChapterClick = (comicSlug, chapter) => {
    setSelectedComic(comicSlug);
    setReadingChapter(chapter);
    setCurrentPage('reader');
  };

  const handleBackClick = () => {
    if (currentPage === 'reader') {
      setCurrentPage('comic-info');
    } else {
      setCurrentPage('home');
    }
    setSelectedComic(null);
    setReadingChapter(null);
    setComicInfo(null);
  };

  const handleNextChapter = () => {
    if (comicInfo && comicInfo.chapter_list) {
      const currentIndex = comicInfo.chapter_list.findIndex(ch => ch.endpoint === readingChapter);
      if (currentIndex > 0) {
        setReadingChapter(comicInfo.chapter_list[currentIndex - 1].endpoint);
      }
    }
  };

  const handlePreviousChapter = () => {
    if (comicInfo && comicInfo.chapter_list) {
      const currentIndex = comicInfo.chapter_list.findIndex(ch => ch.endpoint === readingChapter);
      if (currentIndex < comicInfo.chapter_list.length - 1) {
        setReadingChapter(comicInfo.chapter_list[currentIndex + 1].endpoint);
      }
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage onComicClick={handleComicClick} />;
      case 'history':
        return <HistoryPage onComicClick={handleComicClick} />;
      case 'comic-info':
        return (
          <ComicInfoPage 
            comicInfo={comicInfo}
            onBackClick={handleBackClick}
            onChapterClick={handleChapterClick}
          />
        );
      case 'reader':
        return (
          <MangaReader 
            comicSlug={selectedComic}
            chapter={readingChapter}
            onBackClick={handleBackClick}
            onNextChapter={handleNextChapter}
            onPreviousChapter={handlePreviousChapter}
          />
        );
      default:
        return <HomePage onComicClick={handleComicClick} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
      {currentPage !== 'reader' && (
        <nav className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg">
          <div className="flex justify-around p-3">
            {[
              { icon: Home, label: 'Home', id: 'home' },
              { icon: Search, label: 'Search', id: 'search' },
              { icon: History, label: 'History', id: 'history' }
            ].map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex flex-col items-center ${
                  currentPage === id ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;