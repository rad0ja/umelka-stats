import Image from "next/image"

export default function Karta() {
    const logo1 = require('../../public/assets/twzuzjip.png')

    return (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src="/assets/twzuzjip.png"
                        alt="Company Logo"
                        width={200}   // required
                        height={200}  // required
                        priority      // optional (for above-the-fold images)
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Eberechi Eze
                        </h2>
                        <p className="text-sm text-gray-500">
                            Záložník (Arsenal)
                        </p>
                    </div>
                </div>
                <Image
                    src="/assets/twzuzjip.png"
                    alt="Company Logo"
                    width={200}   // required
                    height={200}  // required
                    priority      // optional (for above-the-fold images)
                />
            </div>

            {/* Player Info */}
            <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p>
                    <span className="font-medium">Věk:</span> 27 (29.06.1998)
                </p>
                <p>
                    <span className="font-medium">Tržní hodnota:</span> €54.6m
                </p>
                <p>
                    <span className="font-medium">Délka kontraktu:</span> 30.06.2029
                </p>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-6 border-t pt-3 text-sm font-medium">
                <button className="text-red-600 border-b-2 border-red-600 pb-1">
                    PŘEHLED
                </button>
                <button className="text-gray-500 hover:text-gray-700">ZPRÁVY</button>
                <button className="text-gray-500 hover:text-gray-700">PŘESTUPY</button>
                <button className="text-gray-500 hover:text-gray-700">
                    HISTORIE ZRANĚNÍ
                </button>
            </div>
        </div>
    );
}
