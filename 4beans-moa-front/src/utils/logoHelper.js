/**
 * Logo Helper Utility
 * Provides functions to get bank and card company logos
 * All logos are stored in /public/images/logos/
 */

// Company name mappings (Korean/English name -> logo filename)
// Used for both banks and card companies (many are the same!)
const LOGO_MAP = {
    // Banks & Cards (Korean)
    "KB국민은행": "kb",
    "KB국민카드": "kb",
    "국민은행": "kb",
    "국민카드": "kb",

    "신한은행": "shinhan",
    "신한카드": "shinhan",

    "우리은행": "woori",
    "우리카드": "woori",

    "하나은행": "hana",
    "하나카드": "hana",
    "KEB하나은행": "hana",

    "NH농협은행": "nh",
    "NH농협카드": "nh",
    "농협은행": "nh",
    "농협카드": "nh",

    "IBK기업은행": "ibk",
    "IBK기업은행카드": "ibk",
    "기업은행": "ibk",

    "SC제일은행": "sc",
    "제일은행": "sc",

    "씨티은행": "citi",
    "한국씨티은행": "citi",
    "씨티카드": "citi",

    "카카오뱅크": "kakao",
    "카카오뱅크카드": "kakao",

    "케이뱅크": "kbank",
    "케이뱅크카드": "kbank",

    "토스뱅크": "toss",
    "토스뱅크카드": "toss",

    // Other Korean Cards
    "비씨카드": "bc",
    "BC카드": "bc",
    "삼성카드": "samsung",
    "현대카드": "hyundai",
    "롯데카드": "lotte",

    // Other Banks
    "새마을금고": "kfcc",
    "신협": "cu",
    "우체국": "post",
    "수협은행": "sh",
    "산업은행": "kdb",
    "BNK부산은행": "bnkbusan",
    "부산은행": "bnkbusan",
    "BNK경남은행": "bnkkyongnam",
    "경남은행": "bnkkyongnam",
    "DGB대구은행": "dgb",
    "대구은행": "dgb",
    "광주은행": "kjbank",
    "제주은행": "jjbank",
    "전북은행": "jbbank",

    // International Cards (from Toss Payments API)
    "VISA": "visa",
    "MASTER": "mastercard",
    "MASTERCARD": "mastercard",
    "AMEX": "amex",
    "JCB": "jcb",
    "DINERS": "diners",
    "DISCOVER": "discover",
    "UNIONPAY": "unionpay",
};

/**
 * Get bank logo path
 * @param {string} bankName - Bank name (e.g., "KB국민은행", "신한은행")
 * @returns {string|null} - Logo path or null if not found
 */
export const getBankLogo = (bankName) => {
    if (!bankName) return null;

    const logoKey = LOGO_MAP[bankName];
    if (logoKey) {
        return `/images/banks/${logoKey}.png`;
    }

    return null;
};

/**
 * Get card company logo path
 * @param {string} cardCompany - Card company name (e.g., "신한카드", "VISA")
 * @returns {string|null} - Logo path or null if not found
 */
export const getCardLogo = (cardCompany) => {
    if (!cardCompany) return null;

    const logoKey = LOGO_MAP[cardCompany];
    if (logoKey) {
        return `/images/cards/${logoKey}.png`;
    }

    return null;
};

/**
 * Get bank color theme (for fallback background)
 * @param {string} bankName - Bank name
 * @returns {object} - Object with bg and text color classes
 */
export const getBankTheme = (bankName) => {
    const themes = {
        "kb": { bg: "bg-yellow-50", text: "text-yellow-600" },
        "shinhan": { bg: "bg-blue-50", text: "text-blue-600" },
        "woori": { bg: "bg-sky-50", text: "text-sky-600" },
        "hana": { bg: "bg-green-50", text: "text-green-600" },
        "nh": { bg: "bg-emerald-50", text: "text-emerald-600" },
        "ibk": { bg: "bg-indigo-50", text: "text-indigo-600" },
        "kakao": { bg: "bg-yellow-100", text: "text-yellow-700" },
        "toss": { bg: "bg-blue-100", text: "text-blue-700" },
        "kbank": { bg: "bg-yellow-50", text: "text-yellow-600" },
    };

    if (!bankName) return { bg: "bg-blue-50", text: "text-blue-600" };

    const logoKey = LOGO_MAP[bankName];
    return themes[logoKey] || { bg: "bg-blue-50", text: "text-blue-600" };
};

/**
 * Get card company color theme (for fallback background)
 * @param {string} cardCompany - Card company name
 * @returns {object} - Object with bg and text color classes
 */
export const getCardTheme = (cardCompany) => {
    const themes = {
        "visa": { bg: "bg-blue-600", text: "text-white" },
        "mastercard": { bg: "bg-orange-500", text: "text-white" },
        "amex": { bg: "bg-cyan-600", text: "text-white" },
        "jcb": { bg: "bg-red-600", text: "text-white" },
        "bc": { bg: "bg-red-500", text: "text-white" },
        "samsung": { bg: "bg-blue-700", text: "text-white" },
        "hyundai": { bg: "bg-gray-800", text: "text-white" },
        "shinhan": { bg: "bg-blue-600", text: "text-white" },
        "kb": { bg: "bg-yellow-500", text: "text-gray-900" },
    };

    if (!cardCompany) return { bg: "bg-gray-800", text: "text-white" };

    const logoKey = LOGO_MAP[cardCompany];
    return themes[logoKey] || { bg: "bg-gray-800", text: "text-white" };
};
