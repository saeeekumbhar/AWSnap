import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 55,
  className = '',
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
      } else {
        clearInterval(timer);
        setIsTypingComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span>{displayedText}</span>
      <span
        className={`inline-block w-2.5 h-6 ml-1.5 bg-[#A855F7] align-middle transition-opacity duration-300 ${
          isTypingComplete ? 'animate-pulse' : 'opacity-100'
        }`}
        style={{ verticalAlign: '-2px' }}
      />
    </span>
  );
};
