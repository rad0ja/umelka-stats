import { useEffect, useState } from "react";


export function useKeyboardVisibility() {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) return;
       
        const handleResize = () => {
            const keyboardHeight = window.innerHeight - window.visualViewport!.height;
            setIsKeyboardVisible(keyboardHeight > 150); // threshold in pixels
        };

        window.visualViewport.addEventListener('resize', handleResize);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
        };
    }, []);

    return isKeyboardVisible;
}