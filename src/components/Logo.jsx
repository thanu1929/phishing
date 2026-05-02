import React from 'react';

export const LogoSVG = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full max-w-[500px] h-auto drop-shadow-xl"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer dark blue */}
    <path d="M 200,20 Q 300,50 360,60 C 360,200 320,300 200,380 C 80,300 40,200 40,60 Q 100,50 200,20 Z" fill="#1a365d" />
    
    {/* Inner yellow */}
    <path d="M 200,32 Q 295,60 350,70 C 350,195 310,290 200,366 C 90,290 50,195 50,70 Q 105,60 200,32 Z" fill="#fbc02d" />
    
    {/* Inner dark blue */}
    <path d="M 200,42 Q 288,68 340,78 C 340,190 300,280 200,352 C 100,280 60,190 60,78 Q 112,68 200,42 Z" fill="#1a365d" />
    
    {/* Center white */}
    <path d="M 200,52 Q 280,75 330,85 C 330,185 292,270 200,338 C 108,270 70,185 70,85 Q 120,75 200,52 Z" fill="#ffffff" />

    {/* Center Building */}
    <g fill="#1a365d">
      {/* Base structure */}
      <rect x="75" y="215" width="250" height="7" />
      <rect x="75" y="226" width="250" height="7" />
      
      {/* Left Wing */}
      <g transform="translate(80, 160)">
        <rect x="0" y="0" width="45" height="55" fill="#1a365d" />
        <rect x="8" y="7" width="12" height="17" fill="#ffffff" />
        <rect x="25" y="7" width="12" height="17" fill="#ffffff" />
        <rect x="8" y="31" width="12" height="17" fill="#ffffff" />
        <rect x="25" y="31" width="12" height="17" fill="#ffffff" />
      </g>

      {/* Right Wing */}
      <g transform="translate(275, 160)">
        <rect x="0" y="0" width="45" height="55" fill="#1a365d" />
        <rect x="8" y="7" width="12" height="17" fill="#ffffff" />
        <rect x="25" y="7" width="12" height="17" fill="#ffffff" />
        <rect x="8" y="31" width="12" height="17" fill="#ffffff" />
        <rect x="25" y="31" width="12" height="17" fill="#ffffff" />
      </g>
      
      {/* Center Pillars */}
      <rect x="135" y="160" width="14" height="55" />
      <rect x="173" y="160" width="14" height="55" />
      <rect x="211" y="160" width="14" height="55" />
      <rect x="249" y="160" width="14" height="55" />
      
      {/* Text A V N */}
      <text x="161" y="202" fontFamily="serif" fontSize="26" fontWeight="bold" textAnchor="middle" fill="#1a365d">A</text>
      <text x="199" y="202" fontFamily="serif" fontSize="26" fontWeight="bold" textAnchor="middle" fill="#1a365d">V</text>
      <text x="237" y="202" fontFamily="serif" fontSize="26" fontWeight="bold" textAnchor="middle" fill="#1a365d">N</text>
      
      {/* Roof */}
      <polygon points="125,160 275,160 200,120" />
      <circle cx="200" cy="144" r="7" fill="#ffffff" />
      
      {/* Flag */}
      <rect x="198" y="90" width="4" height="30" />
      <path d="M 202,90 Q 215,87 225,95 Q 215,100 202,105 Z" />
    </g>

    {/* Tools (Top Left) */}
    <g transform="translate(135, 120)">
      {/* Ruler */}
      <g transform="rotate(-45)">
        <rect x="-24" y="-4" width="48" height="8" fill="#1a365d" rx="2" />
        {/* T-Square lines */}
        <rect x="-18" y="-4" width="2" height="5" fill="#ffffff" />
        <rect x="-12" y="-4" width="2" height="5" fill="#ffffff" />
        <rect x="-6" y="-4" width="2" height="5" fill="#ffffff" />
        <rect x="0" y="-4" width="2" height="5" fill="#ffffff" />
        <rect x="6" y="-4" width="2" height="5" fill="#ffffff" />
        <rect x="12" y="-4" width="2" height="5" fill="#ffffff" />
        <rect x="18" y="-4" width="2" height="5" fill="#ffffff" />
      </g>
      {/* Hammer */}
      <g transform="rotate(45)">
        <rect x="-4" y="-20" width="8" height="40" fill="#1a365d" rx="2" />
        <rect x="-10" y="-23" width="20" height="12" fill="#1a365d" rx="2" />
        <polygon points="-10,-23 -14,-20 -10,-17" fill="#1a365d" />
      </g>
    </g>

    {/* Gear (Top Right) */}
    <g transform="translate(265, 120)" fill="#1a365d">
      <circle cx="0" cy="0" r="16" />
      <circle cx="0" cy="0" r="7" fill="#ffffff" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <rect key={angle} x="-4" y="-22" width="8" height="10" transform={`rotate(${angle})`} rx="1" />
      ))}
    </g>

    {/* Banner */}
    <g>
      <path d="M 65,245 Q 200,255 335,245 L 330,275 Q 200,285 70,275 Z" fill="#1a365d" />
      <text x="200" y="267" fontFamily="sans-serif" fontSize="14" fill="#ffffff" fontWeight="bold" textAnchor="middle" letterSpacing="4">
        VEDHA TEAM
      </text>
    </g>

    {/* Lotus Bottom */}
    <g transform="translate(200, 320)" fill="#1a365d">
      <path d="M 0,10 C -15,-10 -15,-25 0,-30 C 15,-25 15,-10 0,10 Z" />
      <path d="M -5,8 C -25,-5 -30,-15 -20,-25 C -10,-20 0,-10 -5,8 Z" />
      <path d="M 5,8 C 25,-5 30,-15 20,-25 C 10,-20 0,-10 5,8 Z" />
      <path d="M -10,12 C -30,5 -35,-5 -25,-10 C -15,-5 0,5 -10,12 Z" />
      <path d="M 10,12 C 30,5 35,-5 25,-10 C 15,-5 0,5 10,12 Z" />
      <circle cx="0" cy="18" r="4" />
    </g>
  </svg>
);
