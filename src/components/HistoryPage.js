import React, { useState, useEffect } from 'react';
import { clearSearchResults } from '../utils/searchUtils';
import { signInWithGoogle, backupHistoryToGoogle, getCurrentUser, getBackupCount, getBackupData, logout } from '../utils/googleAuth';
import { useTheme } from '../utils/Theme';

const HistoryPage = ({ onMangaSelect }) => {
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState(null);
    const [backupCount, setBackupCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);

    useEffect(() => {
        clearSearchResults();
        try {
            const storedHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
            const sortedHistory = storedHistory.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
            setHistory(sortedHistory);
        } catch (error) {
            console.error('Error loading history:', error);
            setHistory([]);
        }

        checkUserAuthentication();
    }, []);

    const checkUserAuthentication = async () => {
        const user = await getCurrentUser();
        if (user) {
            setIsAuthenticated(true);
            setUserName(user.email);
            const count = await getBackupCount(user.uid);
            setBackupCount(count);
            setHistory(await getBackupData(user.uid))
        }
    };

    const handleGoogleBackup = () => {
        setShowWarning(true);
    };

    const confirmBackup = async () => {
        setShowWarning(false);
        try {
            const user = await signInWithGoogle();
            setIsAuthenticated(true);
            setUserName(user.displayName || user.email);
            
            if(!user) {
                await backupHistoryToGoogle(history);
            }

            const count = await getBackupCount(user.uid);
            setHistory(await getBackupData(user.uid))
            setBackupCount(count);
            // alert("History berhasil di-backup ke Google!");
        } catch (error) {
            console.error('Error during Google backup:', error);
            // alert("Gagal melakukan backup ke Google.");
        }
    };

    const handleCancel = () => {
        setShowWarning(false);
    };

    const handleLogout = () => {
        setShowLogoutWarning(true);
    };
    
    const confirmLogout = async () => {
        setShowLogoutWarning(false);
        try {
            localStorage.setItem('readingHistory', JSON.stringify(history));
            
            await logout();
            setIsAuthenticated(false);
            setUserName(null);
            setBackupCount(0);
            // alert("Berhasil logout dari akun Google.");
        } catch (error) {
            console.error('Error during logout:', error);
            // alert("Gagal logout dari akun Google.");
        }
    };
    
    const cancelLogout = () => {
        setShowLogoutWarning(false);
    };

    const handleMangaClick = async (historyItem) => {
        setLoading(true);
        try {
            const cleanUrl = historyItem.manga_url.replace(/^\//, "");
            const response = await fetch(`https://id-comic-api.vercel.app/api/${historyItem.source}/info/${cleanUrl}`);
            const data = await response.json();

            if (data.data) {
                const chapterData = {
                    ...historyItem.lastReadChapter,
                    title: historyItem.title,
                    thumbnail: historyItem.cover || historyItem.thumbnail,
                    isFromHistory: true,
                    endpoint: historyItem.lastReadChapter.endpoint,
                    manga_info: data.data,
                    chapter_list: data.data.chapter_list || []
                };
                onMangaSelect(chapterData, historyItem.source);
            }
        } catch (error) {
            console.error('Error fetching manga info:', error);
            const chapterData = {
                ...historyItem.lastReadChapter,
                title: historyItem.title,
                thumbnail: historyItem.cover || historyItem.thumbnail,
                isFromHistory: true,
                endpoint: historyItem.lastReadChapter.endpoint,
                chapter_list: []
            };
            onMangaSelect(chapterData, historyItem.source);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            return 'Unknown date';
        }
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
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
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Reading History
            </h1>

            {/* Modal Warning untuk Google Backup */}
            {showWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100 shadow-xl`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Warning
                            </h2>
                            <button 
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                            <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                                Jika Anda sudah memiliki akun Google yang terautentikasi, history Anda yang sekarang akan hilang. Apakah Anda yakin ingin melanjutkan?
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            {/* Buttons remain the same as they have good contrast in both themes */}
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Cancel
                            </button>
                            <button
                                onClick={confirmBackup}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Warning untuk Logout */}
            {showLogoutWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100 shadow-xl`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Warning
                            </h2>
                            <button 
                                onClick={cancelLogout}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 mb-4">
                            <p className="text-gray-200">
                                Data tidak akan disimpan lagi ke dalam cloud, namun history yang telah Anda baca akan tetap ada. Apakah Anda yakin ingin melanjutkan?
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`mb-4 p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                            onClick={handleGoogleBackup}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Google Backup</span>
                        </button>
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                    {isAuthenticated && (
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center sm:text-right`}>
                            <div className="flex items-center justify-center sm:justify-end gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{userName}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-end gap-2 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                <p>Total Data: <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{backupCount}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {history.length === 0 ? (
                <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-8`}>
                    <p>No reading history yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item, index) => (
                        <button
                            key={`${item.title}-${index}`}
                            onClick={() => handleMangaClick(item)}
                            disabled={loading}
                            className={`w-full ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } rounded-lg shadow-md overflow-hidden flex text-left ${
                                loading 
                                    ? 'opacity-50 cursor-wait' 
                                    : theme === 'dark'
                                        ? 'hover:bg-gray-700'
                                        : 'hover:bg-gray-50'
                            } transition duration-200 ease-in-out`}
                        >
                            <div className="relative w-24 h-32">
                                <img
                                    src={item.cover || item.thumbnail || "/api/placeholder/100/150"}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/100/150";
                                    }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-2 py-1">
                                    <span className="text-xs text-white">{item.source}</span>
                                </div>
                            </div>
                            <div className="p-3 flex-1">
                                <h3 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                                    {item.title}
                                </h3>
                                <p className="text-xs text-blue-400 mt-1">
                                    {item.lastReadChapter.name}
                                </p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} mt-1`}>
                                    {formatDate(item.lastReadAt)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;