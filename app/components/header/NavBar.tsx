import { useState } from "react"
import SeasonPicker from "@/app/components/SeasonPicker";

export default function NavBar() {
    const [active, setActive] = useState("overview")

    const items = [
        { key: "overview", label: "Overview" },
        { key: "players", label: "Players" },
        { key: "table", label: "Table" },
    ]

    return (
        <nav className="w-full border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-6 sm:space-x-10 h-12 items-center">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActive(item.key)}
                            className={`relative text-sm sm:text-base font-medium transition-colors ${
                                active === item.key
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:text-blue-500"
                            }`}
                        >
                            {item.label}
                            {active === item.key && (
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    )
}

