const fs = require('fs');
const path = './src/components/common/HeaderView.jsx';

let content = fs.readFileSync(path, 'utf8');

// ADMIN 뱃지 - 더 작게
content = content.replace(
  '<Badge className="bg-lime-400 text-black border-0 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">',
  '<Badge className="bg-lime-400 text-black border-0 px-1.5 py-0 text-[9px] font-black rounded-full">'
);

// KAKAO 뱃지 - 더 작게
content = content.replace(
  '<Badge className="bg-[#FEE500] text-black border-0 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">',
  '<Badge className="bg-[#FEE500] text-black border-0 px-1.5 py-0 text-[9px] font-black rounded-full">'
);

// GOOGLE 뱃지 - 더 작게
content = content.replace(
  '<Badge className="bg-white text-black border border-gray-300 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">',
  '<Badge className="bg-white text-black border border-gray-300 px-1.5 py-0 text-[9px] font-black rounded-full">'
);

// EMAIL 뱃지 - 더 작게
content = content.replace(
  '<Badge className="bg-pink-100 text-pink-600 border-0 px-2.5 py-0.5 text-[10px] font-black rounded-full inline-flex items-center justify-center">',
  '<Badge className="bg-pink-100 text-pink-600 border-0 px-1.5 py-0 text-[9px] font-black rounded-full">'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
