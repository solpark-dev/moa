const fs = require('fs');
const path = './src/components/common/HeaderView.jsx';

let content = fs.readFileSync(path, 'utf8');

// ADMIN 뱃지
content = content.replace(
  '<Badge className="bg-lime-400 text-black border border-gray-200 h-6 px-1.5 text-[10px] font-black rounded-md leading-none">',
  '<Badge className="bg-lime-400 text-black border-0 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">'
);

// KAKAO 뱃지
content = content.replace(
  '<Badge className="bg-[#FEE500] text-black border border-gray-200 h-6 text-[11px] px-2 font-black rounded-lg">',
  '<Badge className="bg-[#FEE500] text-black border-0 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">'
);

// GOOGLE 뱃지
content = content.replace(
  '<Badge className="bg-white text-black border border-gray-200 h-6 text-[11px] px-2 font-black rounded-lg">',
  '<Badge className="bg-white text-black border border-gray-300 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">'
);

// EMAIL 뱃지
content = content.replace(
  '<Badge className="bg-slate-100 text-black border border-gray-200 h-6 text-[11px] px-2 font-black rounded-lg">',
  '<Badge className="bg-pink-100 text-pink-600 border-0 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
