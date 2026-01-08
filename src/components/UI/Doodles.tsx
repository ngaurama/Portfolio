import { useCamera } from "../../hooks/useCamera"
export default function Doodles() {
    const { currentView } = useCamera()
    
    return (
        <>
            {currentView === 'side'  && (
                <>
                    <img
                        src="/computer.gif"
                        alt="Computer Doodle"
                        title="Hello, Wordl!"
                        className="fixed top-[12%] left-[5%] -rotate-20 w-[12vw] max-w-[200px] min-w-[100px] z-20 hover:scale-110 cursor-pointer non-selectable transition-transform"
                        //     className="fixed m-4 top-30% left-40 -rotate-20 transform -translate-x-1/2 w-[200px] z-20 hover:scale-110 transition-transform"
                    />
                    {/* <img
                        src="/sudo_black.gif"
                        alt="sudo rm -rf /"
                        title="I even have a shirt with this"
                        className="fixed m-4 bottom-80 -right-30 rotate-20 transform -translate-x-1/2 w-[300px] z-20 hover:scale-110 transition-transform"
                    /> */}
                    <img
                        src="/notes.gif"
                        alt="Music notes"
                        // className="fixed m-4 bottom-0 left-20 rotate-20 transform -translate-x-1/2 w-[150px] z-20 transition-transform"
                        className="fixed bottom-[5%] left-[2%] rotate-20 w-[8vw] max-w-[150px] min-w-[80px] z-20 non-selectable transition-transform"
                    />
                    <img
                        src="/sisyphus.gif"
                        alt="Sisyphus moving the boulder"
                        title="One must imagine..."
                        // className="fixed m-4 -bottom-5 -right-24 transform -translate-x-1/2 w-[150px] z-20 transition-transform"
                        className="fixed bottom-[-0.5%] right-[-0.5%] w-[10vw] max-w-[150px] min-w-[80px] z-20 hover:scale-110 cursor-pointer non-selectable transition-transform"                    />
                    <img
                        src="/guitar_face_again.gif"
                        alt="Guitar dude"
                        title="AC/DC? More like... AD/HD"
                        // className="fixed m-4 top-20 -right-10 rotate-20 scale-x-[-1] transform -translate-x-1/2 w-[100px] z-20 hover:scale-110 transition-transform"
                        className="fixed top-[10%] right-[2%] rotate-20 scale-x-[-1] w-[6vw] max-w-[100px] min-w-[60px] z-20 hover:scale-110 cursor-pointer non-selectable transition-transform"
                    />
                </>
            )}
        </>
    )
}
