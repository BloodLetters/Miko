import { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

const proxyUrl = "" //"https://thingproxy.freeboard.io/fetch/";

const SearchHelper = ({ searchTerm, onLoadComplete, onComicClick, fetchType }) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPopularComics = async () => {
    try {
      const response = await axios.get("/api/komiku");
      const cleanHTML = DOMPurify.sanitize(response.data);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHTML, "text/html");

      let mangaList = [];

      if (fetchType === "manga") {
        const mangaSection = doc.getElementById("Komik_Hot_Manga");
        if (mangaSection) {
          mangaList = Array.from(mangaSection.querySelectorAll(".ls2")).map((item) => {
            const title = item.querySelector("h3 a")?.textContent.trim();
            const link = item.querySelector("h3 a")?.getAttribute("href");
            const image = item.querySelector("img.lazy")?.getAttribute("data-src");
            return { title, link, image };
          });
        }
      } else if (fetchType === "manhwa") {
        const manhwaSection = doc.getElementById("Komik_Hot_Manhwa");
        if (manhwaSection) {
          mangaList = Array.from(manhwaSection.querySelectorAll(".ls2")).map((item) => {
            const title = item.querySelector("h3 a")?.textContent.trim();
            const link = item.querySelector("h3 a")?.getAttribute("href");
            const image = item.querySelector("img.lazy")?.getAttribute("data-src");
            return { title, link, image };
          });
        }
      } else if (fetchType === "manhua") {
        const manhuaSection = doc.getElementById("Komik_Hot_Manhua");
        if (manhuaSection) {
          mangaList = Array.from(manhuaSection.querySelectorAll(".ls2")).map((item) => {
            const title = item.querySelector("h3 a")?.textContent.trim();
            const link = item.querySelector("h3 a")?.getAttribute("href");
            const image = item.querySelector("img.lazy")?.getAttribute("data-src");
            return { title, link, image };
          });
        }
      }

      setResults(mangaList);
    } catch (error) {
      console.error("Error fetching popular comics:", error);
      setError("Failed to fetch popular comics. Please try again.");
    } finally {
      setIsLoading(false);
      onLoadComplete?.();
    }
  };

  const fetchSearchResults = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(proxyUrl + `/api/komiku-api/post_type=manga&s=${encodeURIComponent(searchTerm)}`);
      const cleanHTML = DOMPurify.sanitize(response.data);
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHTML, "text/html");

      const mangaList = Array.from(doc.querySelectorAll(".bge")).map((manga) => {
        const title = manga.querySelector("h3")?.textContent.trim();
        const link = manga.querySelector(".bgei a")?.getAttribute("href");
        const image = manga.querySelector(".bgei img")?.getAttribute("src");
        return { title, link, image };
      });

      setResults(mangaList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch manga. Please try again.");
    } finally {
      setIsLoading(false);
      onLoadComplete?.();
    }
  };

  useEffect(() => {
    if (fetchType === "search") {
      fetchSearchResults();
    } else {
      fetchPopularComics();
    }
  }, [searchTerm, fetchType, onLoadComplete]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {results.length > 0 ? (
        results.map((manga, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onComicClick(manga.link)} // Panggil onComicClick dengan link komik
          >
            <img 
              src={manga.image} 
              alt={manga.title} 
              className="w-full h-48 object-cover rounded-xl"
            />
            <h3 className="text-lg font-semibold mt-2 text-white">{manga.title}</h3>
          </div>
        ))
      ) : (
        isLoading && (
          <div className="col-span-2 text-center text-gray-400">
            <p>Loading!</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchHelper;