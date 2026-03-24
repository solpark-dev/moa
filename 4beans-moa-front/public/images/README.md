# Logo Files Guide

This folder contains bank and card company logos used in the wallet page.

## Folder Structure

```
public/images/
├── banks/          # Bank logos
│   ├── kb.png
│   ├── shinhan.png
│   ├── woori.png
│   └── ...
└── cards/          # Card company logos
    ├── visa.png
    ├── mastercard.png
    ├── bc.png
    └── ...
```

## How to Add Logos

### 1. Bank Logos (`/public/images/banks/`)

Place bank logo files with these filenames:

| Bank Name (Korean) | Filename | Example |
|-------------------|----------|---------|
| KB국민은행, 국민은행 | `kb.png` | KB logo |
| 신한은행 | `shinhan.png` | Shinhan logo |
| 우리은행 | `woori.png` | Woori logo |
| 하나은행, KEB하나은행 | `hana.png` | Hana logo |
| NH농협은행, 농협은행 | `nh.png` | NH logo |
| IBK기업은행, 기업은행 | `ibk.png` | IBK logo |
| 카카오뱅크 | `kakao.png` | Kakao logo |
| 토스뱅크 | `toss.png` | Toss logo |
| 케이뱅크 | `kbank.png` | K Bank logo |
| 씨티은행, 한국씨티은행 | `citi.png` | Citi logo |
| SC제일은행, 제일은행 | `sc.png` | SC logo |
| BNK부산은행, 부산은행 | `bnkbusan.png` | BNK Busan logo |
| DGB대구은행, 대구은행 | `dgb.png` | DGB logo |
| 우체국 | `post.png` | Post Office logo |

### 2. Card Company Logos (`/public/images/cards/`)

Place card company logo files with these filenames:

| Card Company | Filename | Example |
|-------------|----------|---------|
| VISA | `visa.png` | Visa logo |
| MASTER, MASTERCARD | `mastercard.png` | Mastercard logo |
| AMEX | `amex.png` | American Express logo |
| JCB | `jcb.png` | JCB logo |
| BC카드, 비씨카드 | `bc.png` | BC Card logo |
| 삼성카드 | `samsung.png` | Samsung Card logo |
| 현대카드 | `hyundai.png` | Hyundai Card logo |
| 신한카드 | `shinhan.png` | Shinhan Card logo |
| KB국민카드, 국민카드 | `kb.png` | KB Card logo |
| 롯데카드 | `lotte.png` | Lotte Card logo |
| 하나카드 | `hana.png` | Hana Card logo |
| 카카오뱅크카드 | `kakao.png` | Kakao Bank Card logo |

## Logo Requirements

- **Format**: PNG (recommended) or JPG
- **Size**: 200x200px to 512x512px (square format recommended)
- **Background**: Transparent PNG preferred (or white background)
- **Quality**: High resolution for sharp display

## How It Works

1. **Logo Display**: If a logo file exists, it will be displayed
2. **Fallback Icon**: If logo doesn't exist, a colored icon will be shown instead
3. **Automatic**: No code changes needed - just add the PNG files

## Where to Get Logos

### Option 1: Official Sources
- Bank websites (footer or press kit sections)
- Card company official websites
- Brand guideline pages

### Option 2: Free Logo Resources
- [Brandfetch](https://brandfetch.com/) - Search for company logos
- [Clearbit Logo API](https://clearbit.com/logo) - `https://logo.clearbit.com/[domain].com`
- [Logo.dev](https://logo.dev/) - Company logo API

### Option 3: Google Images
- Search: "[Company Name] logo png transparent"
- Use high-quality, official-looking versions

## Example: Adding KB Bank Logo

1. Download KB Bank logo (kb.png)
2. Place it in: `public/images/banks/kb.png`
3. Refresh the page - logo will appear automatically!

## Customization

If you need to add more banks or cards, edit:
- `src/utils/logoHelper.js`
- Add new entries to `BANK_LOGO_MAP` or `CARD_LOGO_MAP`

Example:
```javascript
const BANK_LOGO_MAP = {
    "새로운은행": "newbank",  // Maps to /images/banks/newbank.png
    ...
};
```

## Testing

To test logos are working:
1. Add a PNG file to the appropriate folder
2. Make sure the filename matches the mapping in `logoHelper.js`
3. Reload your wallet page
4. The logo should appear instead of the generic icon

## Troubleshooting

**Logo not appearing?**
- Check filename matches exactly (case-sensitive)
- Check file is in correct folder (`/public/images/banks/` or `/public/images/cards/`)
- Check file extension is `.png`
- Try clearing browser cache
- Check browser console for errors

**Logo looks blurry?**
- Use higher resolution image (at least 200x200px)
- Use PNG format instead of JPG

**Logo doesn't fit well?**
- Logo should be square or close to square
- System will automatically scale and center the logo
