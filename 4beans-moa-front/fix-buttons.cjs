const fs = require('fs');
let content = fs.readFileSync('src/pages/main/sections/MainHeroSection.jsx', 'utf8');

// 회원가입 버튼 교체
content = content.replace(
  `<Link to="/signup">
                <button className="px-4 py-3 font-bold bg-pink-500 text-white border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all text-sm flex items-center gap-2">
                  회원가입
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>`,
  `<Link to="/signup">
                <NeoButton color="bg-pink-500 text-white" size="xs">
                  회원가입
                  <ArrowRight className="w-4 h-4" />
                </NeoButton>
              </Link>`
);

// 파티 만들기 버튼 교체
content = content.replace(
  `<Link to="/party/create">
                <button className="px-4 py-3 font-bold bg-cyan-400 text-black border border-gray-200 rounded-xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  파티 만들기
                </button>
              </Link>`,
  `<Link to="/party/create">
                <NeoButton color="bg-cyan-400 text-black" size="xs">
                  <Plus className="w-4 h-4" />
                  파티 만들기
                </NeoButton>
              </Link>`
);

fs.writeFileSync('src/pages/main/sections/MainHeroSection.jsx', content, 'utf8');
console.log('Buttons replaced with NeoButton!');
