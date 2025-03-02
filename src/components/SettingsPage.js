import React, { useState } from 'react';
import { useTheme } from '../utils/Theme';

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    // const [readingMode, setReadingMode] = useState('vertical');
    // const [language, setLanguage] = useState('en');
    // const [notifications, setNotifications] = useState(true);
    // const [imageQuality, setImageQuality] = useState('high');
    // const [autoUpdate, setAutoUpdate] = useState(true);

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
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">Reading Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Reading Mode</span>
                                <select 
                                    value={readingMode}
                                    onChange={(e) => setReadingMode(e.target.value)}
                                    className={`${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                    } rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="vertical">Vertical</option>
                                    <option value="horizontal">Horizontal</option>
                                    <option value="webtoon">Webtoon</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Image Quality</span>
                                <select 
                                    value={imageQuality}
                                    onChange={(e) => setImageQuality(e.target.value)}
                                    className={`${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                    } rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
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
                    </div>

                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">Notifications</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Enable Notifications</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={notifications}
                                        onChange={(e) => setNotifications(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Auto Update</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={autoUpdate}
                                        onChange={(e) => setAutoUpdate(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                        </div>
                    </div> */}

                    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
                        <h2 className="text-lg font-semibold mb-4 text-blue-400">About</h2>
                        <div className="space-y-2">
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Version: 1.0.0</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Built with ❤️ by BloodLetters</p>
                            <button className="text-sm text-blue-400 hover:text-blue-300">Check for Updates</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;