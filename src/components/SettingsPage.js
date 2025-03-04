import React, { useState } from 'react';
import { useTheme } from '../utils/Theme';

const version = "1.2"

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const [updateStatus, setUpdateStatus] = useState(null);

    const checkForUpdates = async () => {
        try {
            const response = await fetch('https://api.github.com/repos/BloodLetters/Miko/releases/latest');
            const data = await response.json();
            
            const currentVersion = `v${version}`;
            if (data.tag_name > currentVersion) {
                setUpdateStatus('Required Update');
            } else {
                setUpdateStatus('latest');
            }
        } catch (error) {
            setUpdateStatus('error');
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className={`fixed top-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg z-50`}>
                <div className="container mx-auto px-4 py-3">
                    <h1 className="text-xl font-bold">Settings</h1>
                </div>
            </div>

            <div className="container mx-auto pt-16 px-4 pb-20">
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Appearance Section */}
                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">Appearance</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Theme</span>
                                <select 
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className={`${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                    } rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500`}
                                    style={{
                                        color: theme === 'dark' ? '#fff' : '#111827'
                                    }}
                                >
                                    <option value="dark" style={{color: theme === 'dark' ? '#fff' : '#111827'}}>Dark</option>
                                    <option value="light" style={{color: theme === 'dark' ? '#fff' : '#111827'}}>Light</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">Language</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Language</span>
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className={`${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                    } rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="en">English</option>
                                    <option value="id">Indonesia</option>
                                    <option value="ja">Japanese</option>
                                </select>
                            </div>
                        </div>
                    </div> */}

                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">About</h2>
                        <div className="space-y-2">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Version: v{version}</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Built with ❤️ by BloodLetters</p>
                            <button 
                                onClick={checkForUpdates}
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                Check for Updates
                            </button>
                            
                            {updateStatus && (
                                <div className={`mt-3 p-2 rounded ${
                                    updateStatus === 'Required Update'
                                        ? theme === 'dark' 
                                            ? 'bg-yellow-800/50 text-yellow-200'
                                            : 'bg-yellow-100 text-yellow-800'
                                        : updateStatus === 'latest'
                                            ? theme === 'dark'
                                                ? 'bg-green-800/50 text-green-200'
                                                : 'bg-green-100 text-green-800'
                                            : theme === 'dark'
                                                ? 'bg-red-800/50 text-red-200'
                                                : 'bg-red-100 text-red-800'
                                }`}>
                                    <p className="text-sm">
                                        {updateStatus === 'Required Update' && 'Versi terbaru tersedia'}
                                        {updateStatus === 'latest' && 'Kamu sudah berada di versi terbaru'}
                                        {updateStatus === 'error' && 'Gagal memeriksa pembaruan'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;