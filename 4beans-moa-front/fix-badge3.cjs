const fs = require('fs');
const path = './src/components/common/HeaderView.jsx';

let content = fs.readFileSync(path, 'utf8');

// KAKAO → K
content = content.replace(
  /(<Badge className="bg-\[#FEE500\][^>]*>)\s*KAKAO\s*(<\/Badge>)/,
  '$1K$2'
);

// GOOGLE → G  
content = content.replace(
  /(<Badge className="bg-white[^>]*>)\s*GOOGLE\s*(<\/Badge>)/,
  '$1G$2'
);

// EMAIL → @
content = content.replace(
  /(<Badge className="bg-pink-100[^>]*>)\s*EMAIL\s*(<\/Badge>)/,
  '$1@$2'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
