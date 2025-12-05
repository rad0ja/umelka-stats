'use client'

import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Calendar, Trophy, MessageCircle, ChevronRight } from 'lucide-react';
import Link from "next/link";

export default function FotbalekLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Users className="w-8 h-8" />,
            title: "Find Players",
            description: "Connect with local soccer enthusiasts and build your dream team"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Organize Matches",
            description: "Schedule games, manage attendance, and never miss a kickoff"
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Track Stats",
            description: "Keep score, track performance, and celebrate victories"
        },
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: "Team Chat",
            description: "Stay connected with your squad through built-in messaging"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
            {/* Navigation */}
            <nav className={`fixed w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center transform rotate-45">
                                <div className="transform -rotate-45 text-white font-bold text-xl">⚽</div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Fotbalek.App
              </span>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
                            <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">About</a>
                            <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors">Contact</a>
                        </div>

                        <button className="hidden md:block bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
                            Get Started
                        </button>

                        <button
                            className="md:hidden text-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-4 space-y-3">
                            <a href="#features" className="block text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
                            <a href="#about" className="block text-gray-700 hover:text-emerald-600 transition-colors">About</a>
                            <a href="#contact" className="block text-gray-700 hover:text-emerald-600 transition-colors">Contact</a>
                            <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                Your Soccer
                                <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Community
                </span>
                                Awaits
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Connect with players, organize matches, and celebrate the beautiful game.
                                Fotbalek makes it easy to keep your soccer community thriving.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={"/login"}
                                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    Join Now <ChevronRight className="w-5 h-5" />
                                </Link>
                                <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-50 transition-all">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl transform rotate-6 opacity-20"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                            JD
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Match Tomorrow</p>
                                            <p className="text-sm text-gray-600">Park Footbal Field • 6:00 PM</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-emerald-700">24</p>
                                            <p className="text-xs text-gray-600">Players</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-emerald-700">12</p>
                                            <p className="text-xs text-gray-600">Matches</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-emerald-700">8</p>
                                            <p className="text-xs text-gray-600">Teams</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600">
                            Built for players, by players
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-12 text-center shadow-2xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Play?
                    </h2>
                    <p className="text-xl text-emerald-50 mb-8">
                        Join thousands of soccer players already using Fotbalek.App
                    </p>
                    <button className="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
                        Start Your Free Trial
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center transform rotate-45">
                            <div className="transform -rotate-45 text-white font-bold text-xl">⚽</div>
                        </div>
                        <span className="text-2xl font-bold">Fotbalek.App</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Bringing soccer communities together, one match at a time.
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2024 Fotbalek.App. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}