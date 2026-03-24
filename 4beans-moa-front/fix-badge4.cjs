const fs = require('fs');
const path = './src/components/common/HeaderView.jsx';

let content = fs.readFileSync(path, 'utf8');

// 모든 Badge에 w-fit 추가
content = content.replace(
  /<Badge className="bg-lime-400/g,
  '<Badge className="w-fit bg-lime-400'
);

content = content.replace(
  /<Badge className="bg-\[#FEE500\]/g,
  '<Badge className="w-fit bg-[#FEE500]'
);

content = content.replace(
  /<Badge className="bg-white/g,
  '<Badge className="w-fit bg-white'
);

content = content.replace(
  /<Badge className="bg-pink-100/g,
  '<Badge className="w-fit bg-pink-100'
);

// 텍스트 원복
content = content.replace(/>K<\/Badge>/, '>KAKAO</Badge>');
content = content.replace(/>G<\/Badge>/, '>GOOGLE</Badge>');
content = content.replace(/>@<\/Badge>/, '>EMAIL</Badge>');

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
