import React from 'react';

// 1. Define the type for a single navigation link
interface NavLink {
    label: string;
    href: string;
    icon: React.ReactNode; // Added icon support for the bottom bar
}

// 2. Define the props for the Navbar component
interface NavbarProps {
    links: NavLink[];
    logoText: string;
}

const Navbar = ({ links, logoText }: NavbarProps) => {
    // NOTE: The 'isOpen' state is no longer needed since we are using a persistent bottom bar

    // Helper component for the desktop link item
    const DesktopLink = ({ label, href }: NavLink) => (
        <a
            href={href}
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
        >
            {label}
        </a>
    );

    // Helper component for the mobile link item (with icon)
    const MobileLink = ({ label, href, icon }: NavLink) => (
        <a
            href={href}
            className="flex flex-col items-center justify-center p-2 text-gray-400 hover:text-indigo-400 transition duration-300 flex-1"
        >
            <div className="text-xl">{icon}</div>
            <span className="text-xs mt-1">{label}</span>
        </a>
    );

    return (
        <>
            {/* 1. Standard Header Navbar (Visible on ALL sizes, but links hidden on mobile) */}
            <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        {/* Logo/Title Section - Always visible */}
                        <div className="flex-shrink-0">
                            <a href="/" className="text-white text-2xl font-bold font-mono tracking-wider hover:text-indigo-400 transition duration-300">
                                {logoText}
                            </a>
                        </div>

                        {/* Desktop Links Section - Hidden on mobile (default) and shown on tablet/desktop (sm:block) */}
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                {links.map((link) => (
                                    <DesktopLink key={link.href} {...link} />
                                ))}
                            </div>
                        </div>

                        {/* Placeholder for optional mobile button or icons - Hidden on mobile, shown on desktop
                This space is left empty because the main navigation is now in the fixed bottom bar.
                You could place a search icon or notification bell here if needed.
            */}
                        <div className="sm:hidden">
                            {/* Optional mobile-only icons can go here */}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 2. Fixed Bottom Mobile Navbar (Hidden on tablet/desktop and shown only on mobile) */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-700 z-50 flex justify-around sm:hidden">
                {links.map((link) => (
                    <MobileLink key={link.href} {...link} />
                ))}
            </div>

            {/* 3. Padding for Fixed Bottom Bar */}
            {/* This invisible div ensures content doesn't get hidden underneath the fixed bottom bar. */}
            <div className="sm:hidden h-16"></div>
        </>
    );
};

export default Navbar;