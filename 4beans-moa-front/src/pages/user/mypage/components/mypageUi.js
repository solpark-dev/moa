// src/pages/user/components/mypageUi.js
export const PANE_SHADOW = "shadow-[0_4px_12px_rgba(0,0,0,0.08)]";
export const BTN_SHADOW = "shadow-[0_2px_8px_rgba(0,0,0,0.08)]";

export const BTN_WHITE =
  "bg-white text-black border border-gray-200 rounded-xl font-black " +
  BTN_SHADOW +
  " hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:border-gray-300 transition-all duration-150";

export const BTN_WHITE_SM =
  "bg-white text-black border border-gray-200 rounded-xl font-black px-4 py-2 text-sm " +
  BTN_SHADOW +
  " hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:border-gray-300 transition-all duration-150";

export const BTN_WHITE_XS =
  "bg-white text-black border border-gray-200 rounded-xl font-black px-3 py-2 text-xs " +
  BTN_SHADOW +
  " hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:border-gray-300 transition-all duration-150";

export const TAG_PILL =
  "inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-1 text-xs font-black bg-white";

export const safeCall = (...fns) => {
  for (const fn of fns) {
    if (typeof fn === "function") return fn();
  }
  return undefined;
};
