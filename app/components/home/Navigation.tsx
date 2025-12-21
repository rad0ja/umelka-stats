'use client'

import { Menu, X, Home, Calendar, Users, Trophy, Bell } from 'lucide-react';
import Dropdown from "@/app/components/Dropdown";
import SeasonPicker from "@/app/components/SeasonPicker";
import LogoutButton from "@/app/components/LogoutButton";
import { useState } from "react";

interface NavigationProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export default function HomeNavigation() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center transform rotate-45">
                            <div className="transform -rotate-45 text-white font-bold text-xl">⚽</div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Fotbalek.App
                        </span>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        <a href="#" className="flex items-center gap-2 text-emerald-600 font-semibold">
                            <Home className="w-5 h-5" /> Home
                        </a>
                        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                            <Calendar className="w-5 h-5" /> Matches
                        </a>
                        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                            <Users className="w-5 h-5" /> Teams
                        </a>
                        <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                            <Trophy className="w-5 h-5" /> Stats
                        </a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button className="relative">
                            <Bell className="w-6 h-6 text-gray-600 hover:text-emerald-600 transition-colors" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
                            JD
                        </div>
                        <Dropdown />
                        <SeasonPicker />
                        <LogoutButton />
                    </div>

                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 py-4 space-y-3">
                        <a href="#" className="flex items-center gap-2 text-emerald-600 font-semibold">
                            <Home className="w-5 h-5" /> Home
                        </a>
                        <a href="#" className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5" /> Matches
                        </a>
                        <a href="#" className="flex items-center gap-2 text-gray-600">
                            <Users className="w-5 h-5" /> Teams
                        </a>
                        <a href="/ios" className="flex items-center gap-2 text-gray-600">
                            <Trophy className="w-5 h-5" /> iOS
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};
