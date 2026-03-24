const fs = require("fs");
const c = fs.readFileSync("src/pages/landing/LandingPageYSa01.jsx", "utf8");
const heroMatch = c.match(/const ParallaxHero[\s\S]*?^};/m);
console.log("Script created");
