// A simple test script for regex class whitelist logic

const allowedRegex = /^(text|font|bg|p[xytrbl]?|m[xytrbl]?|rounded|shadow|w|h|max-w|leading|tracking|border)(-|$)/;
const forbiddenRegex = /^(fixed|absolute|z-|w-screen|h-screen|inset-)/;

const testClasses = {
  // Allowed classes
  "text-lg": true,
  "font-bold": true,
  "bg-blue-500": true,
  "px-4": true,
  "py-2": true,
  "mt-4": true,
  "mx-auto": true,
  "rounded-md": true,
  "shadow-sm": true,
  "w-full": true,
  "h-64": true,
  "max-w-xl": true,
  "leading-relaxed": true,
  "tracking-wide": true,
  "border-gray-200": true,
  "border": true,
  "p-4": true,
  "m-2": true,
  "pt-1": true,
  "mr-3": true,

  // Forbidden / not matching allowed
  "fixed": false,
  "absolute": false,
  "z-50": false,
  "w-screen": false,
  "h-screen": false,
  "inset-0": false,
  "flex": false,
  "grid": false,
  "items-center": false,
  "justify-between": false,
};

let failures = 0;

for (const [cls, expected] of Object.entries(testClasses)) {
  const isAllowed = allowedRegex.test(cls);
  const isForbidden = forbiddenRegex.test(cls);
  const result = isAllowed && !isForbidden;
  
  if (result !== expected) {
    console.error(`❌ Test failed for class "${cls}". Expected ${expected}, got ${result}`);
    failures++;
  } else {
    console.log(`✅ Class "${cls}" correctly evaluated as ${result}`);
  }
}

if (failures > 0) {
  process.exit(1);
} else {
  console.log("🎉 All regex tests passed successfully!");
}
