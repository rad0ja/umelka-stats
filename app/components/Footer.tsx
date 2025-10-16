import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="mt-8 border-t border-gray-300 dark:border-gray-700 py-6 text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-3">
                {/* Left: Brand / Copyright */}
                <p className="text-xs md:text-sm">
                    © {new Date().getFullYear()} <span className="font-semibold">YourAppName</span>. All rights reserved.
                </p>

                {/* Center: Navigation links */}
                <div className="flex gap-4 justify-center">
                    <Link href="/about" className="hover:underline">
                        About
                    </Link>
                    <Link href="/contact" className="hover:underline">
                        Contact
                    </Link>
                    <Link href="/privacy" className="hover:underline">
                        Privacy
                    </Link>
                </div>

                {/* Right: Social links */}
                <div className="flex gap-3 justify-center">
                    <a
                        href="https://twitter.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                    >
                        <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-800 dark:hover:text-gray-100"
                    >
                        <i className="fa-brands fa-github"></i>
                    </a>
                    <a
                        href="https://linkedin.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700"
                    >
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
