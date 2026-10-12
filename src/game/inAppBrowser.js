// Beágyazott (in-app) böngészők felismerése: Facebook, Instagram, TikTok, Messenger, Google app,
// QR-olvasó appok webview-ja stb. Ezekben a kamera/localStorage megbízhatatlan.
const RULES = [
  /FBAN|FBAV|FB_IAB|FBIOS|FBSS|Messenger/i, // Facebook, Messenger
  /Instagram/i,
  /TikTok|musical_ly|Bytedance/i,
  /Snapchat/i,
  /LinkedInApp/i,
  /Twitter/i,
  /Pinterest/i,
  /\bLine\//i,
  /MicroMessenger|WeChat/i,
  /Viber/i,
  /KAKAOTALK|NAVER\(inapp/i,
  /\bGSA\//i, // Google keresőapp (iOS)
  /; wv\)/i, // Android WebView
  /(iPhone|iPod|iPad)(?!.*Safari\/)/i, // iOS WebView (nincs Safari token)
];

export function isInAppBrowser(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  return RULES.some((re) => re.test(ua));
}
