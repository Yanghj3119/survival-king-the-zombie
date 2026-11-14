import { useEffect, useRef } from 'react';

// BGM 파일을 public/media/bgm.mp3 로 넣어 주세요. (파일이 없으면 소리 없이 진행됩니다)
const BGM_SRC = './media/bgm.mp3';

// BGM · 타이핑 효과음 재생 관리
export default function useGameAudio({ gameState, isBgmPlaying, prologueSkipText, prologueTextDone }) {
  const bgmAudioRef = useRef(null);
  const typingAudioRef = useRef(null);

  // BGM과 타이핑 효과음은 화면 전환에도 재생 위치가 유지되도록 컴포넌트 생명주기 동안 한 번만 생성합니다.
  useEffect(() => {
    const bgm = new Audio(BGM_SRC);
    bgm.loop = true;
    bgm.volume = 0.32;
    bgm.preload = 'auto';
    bgmAudioRef.current = bgm;

    const typing = new Audio('./media/typing.mp3');
    typing.loop = true;
    typing.volume = 0.22;
    typing.preload = 'auto';
    typingAudioRef.current = typing;

    return () => {
      bgm.pause();
      typing.pause();
      bgmAudioRef.current = null;
      typingAudioRef.current = null;
    };
  }, []);

  // 메인 BGM은 생존자 설정(이름 입력) 화면부터 재생하며, 오프닝 영상/프롤로그/튜토리얼 전환에도 끊기지 않습니다.
  useEffect(() => {
    const audio = bgmAudioRef.current;
    if (!audio) return;
    const shouldPlay = ['setup', 'tutorial', 'playing'].includes(gameState) && isBgmPlaying;
    if (shouldPlay) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      if (gameState === 'opening') audio.currentTime = 0;
    }
  }, [gameState, isBgmPlaying]);

  // 사용자가 보여준 긴급 수신 신호 타이핑 장면에 키보드 소리를 배경 레이어로 깝니다.
  useEffect(() => {
    const typing = typingAudioRef.current;
    if (!typing) return;
    const shouldPlayTyping = gameState === 'prologue' && !prologueSkipText && !prologueTextDone;
    if (shouldPlayTyping) {
      typing.play().catch(() => {});
    } else {
      typing.pause();
      typing.currentTime = 0;
    }
  }, [gameState, prologueSkipText, prologueTextDone]);

  return { bgmAudioRef, typingAudioRef };
}
