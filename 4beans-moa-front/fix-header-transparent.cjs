const fs = require('fs');
const path = './src/components/common/HeaderView.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. 헤더 배경 투명
content = content.replace(
  'bg-slate-50 border-b border-gray-200',
  'bg-transparent border-b border-transparent'
);

// 2. Sticker 기본 color를 투명으로
content = content.replace(
  'function Sticker({ children, color = "bg-white", className = "" })',
  'function Sticker({ children, color = "bg-transparent", className = "" })'
);

// 3. Sticker에서 border와 shadow 제거 (투명하게)
content = content.replace(
  '`${color} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-150 ${className}`',
  '`${color} ${className}`'
);

// 4. NavPill 비활성 상태 투명
content = content.replace(
  ': "bg-white/70 backdrop-blur-sm text-black hover:bg-black hover:text-white"',
  ': "bg-transparent text-black hover:bg-black hover:text-white"'
);

// 5. NavPill 내부 아이콘 배경 투명
content = content.replace(
  ': "bg-slate-50 text-black group-hover:bg-white group-hover:text-black"',
  ': "bg-transparent text-black group-hover:bg-white group-hover:text-black"'
);

// 6. NavPill border 제거
content = content.replace(
  'rounded-2xl border border-gray-200 whitespace-nowrap',
  'rounded-2xl border-0 whitespace-nowrap'
);

// 7. NavPill 아이콘 border 제거
content = content.replace(
  'w-7 h-7 rounded-xl border border-gray-200 transition-colors',
  'w-7 h-7 rounded-xl border-0 transition-colors'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
