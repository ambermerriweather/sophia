import React from 'react';

export const Mascot: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 150 150"
    className={className}
    aria-label="A friendly cartoon mascot of a young Black girl with curly hair, smiling."
    role="img"
  >
    <g>
      {/* Head */}
      <circle cx="75" cy="85" r="45" fill="#8d5524" />
      
      {/* Hair */}
      <circle cx="40" cy="50" r="30" fill="#3E2723" />
      <circle cx="110" cy="50" r="30" fill="#3E2723" />
      <circle cx="75" cy="40" r="35" fill="#3E2723" />
      <circle cx="30" cy="80" r="25" fill="#3E2723" />
      <circle cx="120" cy="80" r="25" fill="#3E2723" />
      
      {/* Eyes */}
      <circle cx="60" cy="80" r="10" fill="white" />
      <circle cx="90" cy="80" r="10" fill="white" />
      <circle cx="63" cy="83" r="5" fill="#4E342E" />
      <circle cx="93" cy="83" r="5" fill="#4E342E" />
       {/* Sparkle */}
      <circle cx="58" cy="78" r="2" fill="white" />
      <circle cx="88" cy="78" r="2" fill="white" />
      
      {/* Smile */}
      <path
        d="M 65 100 Q 75 112, 85 100"
        stroke="#4E342E"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
       {/* Cheeks */}
       <circle cx="48" cy="95" r="5" fill="#d08c6d" opacity="0.8"/>
       <circle cx="102" cy="95" r="5" fill="#d08c6d" opacity="0.8"/>
      
       {/* Body */}
      <path d="M 50 125 L 45 150 L 105 150 L 100 125 Z" fill="#F472B6" />
       
       {/* Star on Shirt */}
       <path d="M75 130 L78 138 L86 139 L80 144 L82 152 L75 147 L68 152 L70 144 L64 139 L72 138 Z" fill="#FFD700" />
    </g>
  </svg>
);