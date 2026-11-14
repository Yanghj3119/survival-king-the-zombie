# 생존왕 THE ZOMBIE (React + Vite)

단일 HTML(v1.40)로 되어 있던 게임을 합격기록장(`pass-note`)과 같은 Vite + React 구조로 분리한 버전입니다.

## 실행

```bash
pnpm install
pnpm dev        # 개발 서버
pnpm build      # dist/ 빌드
pnpm preview    # 빌드 결과 미리보기
```

## 구조

```
index.html
vite.config.js / tailwind.config.js / postcss.config.js
public/media/            # 기존 HTML에 base64로 박혀 있던 이미지 · 효과음
src/
  main.jsx               # 진입점
  App.jsx                # gameState 에 따라 화면 전환
  index.css              # Tailwind + 게임 전용 스타일
  hooks/useSurvivalGame.js   # 상태 · 타이머 · 핸들러 (게임 엔진)
  hooks/useGameAudio.js      # BGM · 타이핑 효과음
  lib/                   # gameHelpers(시간 포맷·아이템 아이콘 등), logTones(일지 색상)
  data/                  # config, world(장소·도로), companions, items, player, messages
  data/events/           # 이벤트 분류별 파일 (family, scavenge, combat, recruitment, companions, endings ...)
  components/TypewriterLine.jsx
  components/game/       # 플레이 화면 조각: layout, panels, log, modals
  screens/               # Opening, Video, Prologue, Setup, Tutorial, Playing, GameOver
  screens/endings/       # Vaccine, Betrayal, Companions, Mutant, Chip, Plane, Victory
```

## 참고

- Tailwind는 CDN 대신 빌드 방식(v3.4)으로 전환했습니다.
- 오프닝 영상과 BGM은 기존처럼 외부 GitHub raw URL을 사용합니다.
- `vite.config.js`의 `base: './'` 덕분에 GitHub Pages 같은 하위 경로 배포에서도 `media/` 가 깨지지 않습니다.

- 예전 단일 HTML 버전들은 `legacy-html/` 폴더에 보관되어 있습니다.
