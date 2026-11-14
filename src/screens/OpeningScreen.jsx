export default function OpeningScreen({ setGameState }) {
    return (
      <div className="h-[100dvh] min-h-0 w-full relative overflow-hidden bg-black" style={{ backgroundImage: "url('./media/opening-bg.png')", backgroundSize: '100% 100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
        <button
          aria-label="지옥문 열기"
          title="지옥문 열기"
          onClick={() => setGameState('video')}
          className="absolute z-20 border-0 bg-transparent cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/80"
          style={{ left: '37.4%', top: '66.5%', width: '23.0%', height: '12.0%' }}
        >
          <span className="sr-only">지옥문 열기</span>
        </button>
      </div>
    );
}
