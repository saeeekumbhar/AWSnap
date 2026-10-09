import React from 'react';

interface AwsSbgLogoProps {
  className?: string;
  size?: number;
}

export const AwsSbgLogo: React.FC<AwsSbgLogoProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer Square Identity with subtle border */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="8"
        fill="#121820"
        stroke="#6B21A8"
        strokeWidth="2.5"
      />
      
      {/* Inner frame subtle glow line */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="6"
        stroke="#A855F7"
        strokeOpacity="0.4"
        strokeWidth="1"
      />

      {/* 8-bit pixel motif on top right corner */}
      <rect x="52" y="6" width="3" height="3" fill="#FF9900" />
      <rect x="55" y="6" width="3" height="3" fill="#A855F7" />
      <rect x="52" y="9" width="3" height="3" fill="#A855F7" />
      <rect x="55" y="9" width="3" height="3" fill="#FF9900" />

      {/* AWS Lettering */}
      {/* 'a' */}
      <path
        d="M17.5 28.5C16.2 28.5 15.2 29.5 15.2 30.8C15.2 32.1 16.2 33 17.5 33C18.8 33 19.8 32 19.8 30.8V28.5H17.5ZM19.8 26.8V24.5C19.8 23.3 18.8 22.5 17.5 22.5C16.2 22.5 15.2 23.3 15.2 24.5H13C13 22 15 20.5 17.5 20.5C20.2 20.5 22 22 22 24.5V33H19.8V31.8C19.2 32.8 18.2 33.5 17 33.5C14.8 33.5 13 32 13 29.8C13 27.5 14.8 26 17 26H19.8V26.8Z"
        fill="#F5F3FF"
      />

      {/* 'w' */}
      <path
        d="M23 20.8H25.3L27.2 29.5L29.2 20.8H31.3L33.3 29.5L35.2 20.8H37.5L34.5 33H32.2L30.2 24.5L28.2 33H26L23 20.8Z"
        fill="#F5F3FF"
      />

      {/* 's' */}
      <path
        d="M44.5 23.8H42.2C42.2 22.8 41.5 22.2 40.5 22.2C39.5 22.2 38.8 22.8 38.8 23.6C38.8 24.5 39.5 25 40.8 25.5L42 26C43.8 26.8 44.8 28 44.8 29.8C44.8 32 43 33.5 40.5 33.5C38 33.5 36.2 32 36.2 29.8H38.5C38.5 31 39.5 31.8 40.5 31.8C41.8 31.8 42.5 31 42.5 30C42.5 29 41.8 28.5 40.2 27.8L39 27.2C37.2 26.5 36.5 25.5 36.5 23.8C36.5 21.8 38.2 20.5 40.5 20.5C43 20.5 44.5 22 44.5 23.8Z"
        fill="#F5F3FF"
      />

      {/* Iconic AWS Smile Arrow in AWS Orange (#FF9900) */}
      <path
        d="M14 36.5C21 41.5 38 41.5 45.5 36.8"
        stroke="#FF9900"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M48 35.2L42.5 35.8L44.8 38.8L48 35.2Z"
        fill="#FF9900"
      />

      {/* "SBG" Badge at bottom */}
      <rect x="15" y="44" width="34" height="11" rx="3" fill="#6B21A8" fillOpacity="0.8" />
      <text
        x="32"
        y="52.5"
        fill="#F5F3FF"
        fontSize="7.5"
        fontWeight="bold"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="0.8"
      >
        SBG
      </text>
    </svg>
  );
};
