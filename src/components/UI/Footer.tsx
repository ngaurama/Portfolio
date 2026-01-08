import { useAtom } from "jotai";
import { helpActiveAtom } from "../../atoms/helpAtom";
import { useCamera } from "../../hooks/useCamera";
import { useEffect, useState } from "react";

export default function Footer() {
    const { currentView } = useCamera();
    const [helpActive, setHelpActive] = useAtom(helpActiveAtom);
    const [helpLocked, setHelpLocked] = useState(false);


    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const helpButton = document.querySelector('img[alt="Help"]');
        const target = event.target as Node;
        if (helpButton && !helpButton.contains(target)) {
            setHelpActive(false);
            setHelpLocked(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const isMobile = window.innerWidth < 768;  

    return (
        <>
        <footer style={{ fontFamily: "'gaegu', sans-serif" }}>
            {currentView === "side" && (
                <>
                {/* Help button */}
                <div className="relative">
                    <img
                        src="/help.gif"
                        alt="Help"
                        className="fixed m-4 bottom-0 left-10 transform -translate-x-1/2 w-[60px] z-20 hover:scale-110 cursor-pointer non-selectable transition-transform cursor-pointer"
                        onMouseEnter={() => {
                            if (!isMobile) setHelpActive(true);
                        }}
                        onMouseLeave={() => {
                            if (!isMobile && !helpLocked) setHelpActive(false);
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setHelpLocked(prev => !prev);
                            setHelpActive(true);
                        }}
                    />
                    {helpActive && (
                    <div className="fixed bottom-18 left-14 -translate-x-1/2 text-2xl text-black cursor-pointer non-selectable text-center drop-shadow-outline z-20 pointer-events-none">
                        Help
                    </div>
                    )}
                </div>

                {/* GitHub */}
                <div className="relative">
                    <a href="https://github.com/ngaurama">
                    <img
                        src="/github.gif"
                        alt="Github Logo"
                        className="fixed m-4 bottom-0 left-30 transform -translate-x-1/2 w-[60px] z-20 cursor-pointer non-selectable hover:scale-110 transition-transform"
                    />
                    </a>
                    {helpActive && (
                    <div className="fixed bottom-18 left-34 -translate-x-1/2 text-2xl text-black text-center cursor-pointer non-selectable drop-shadow-outline z-20">
                        GitHub
                    </div>
                    )}
                </div>

                {/* Mail */}
                <div className="relative">
                    <a href="mailto:nitai.gauramani.dev@gmail.com">
                    <img
                        src="/mail.gif"
                        alt="Mail Logo"
                        className="fixed m-4 bottom-0 left-50 transform -translate-x-1/2 w-[70px] z-20 hover:scale-110 cursor-pointer non-selectable transition-transform"
                    />
                    </a>
                    {helpActive && (
                    <div className="fixed bottom-18 left-54 -translate-x-1/2 text-2xl text-black text-center cursor-pointer non-selectable drop-shadow-outline z-20">
                        Mail
                    </div>
                    )}
                </div>
                </>
            )}
        </footer>
        </>
    );
}
