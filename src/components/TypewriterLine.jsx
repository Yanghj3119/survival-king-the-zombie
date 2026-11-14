import { useState, useEffect } from 'react';

export default function TypewriterLine({ text, delay = 0, className = '', skip = false, onComplete }) {
  const [visibleText, setVisibleText] = useState(skip ? text : '');
  useEffect(() => {
    if (skip) {
      setVisibleText(text);
      if (onComplete) onComplete();
      return undefined;
    }
    setVisibleText('');
    let index = 0;
    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          if (onComplete) onComplete();
        }
      }, 28);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, skip]);
  return <p className={className}>{visibleText}{!skip && visibleText.length < text.length && <span className="ml-0.5 text-[#d75b5b] animate-pulse" aria-hidden="true">▌</span>}</p>;
}
