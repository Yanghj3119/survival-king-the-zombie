import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' : GitHub Pages 등 하위 경로 배포에서도 /media 에셋이 깨지지 않도록 상대경로 사용
export default defineConfig({ base: './', plugins: [react()] });
