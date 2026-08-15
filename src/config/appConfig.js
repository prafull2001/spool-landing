// App Configuration
// Set IS_APP_LIVE to true when app is available on App Store
// Set IS_APP_LIVE to false to show waitlist instead
export const APP_CONFIG = {
  IS_APP_LIVE: true, // Change this to true when app is live
  
  // App Store link (when app is live)
  APP_STORE_URL: "https://apps.apple.com/us/app/spool-screen-time-control/id6749428484",

  // Spool is currently iOS-only. Add the Android package here if that changes.
  ANDROID_PACKAGE: null,

  // AppsFlyer OneLinks by ?src=. Unknown or missing sources intentionally fall
  // back to the raw App Store URL.
  ATTRIBUTION_LINKS: {
    manychat: "https://spool.onelink.me/c5xQ/99xx9vdy",
    "instagram-bio": "https://spool.onelink.me/c5xQ/3uxzx1hc",
    alexis_instantdm: "https://spool.onelink.me/c5xQ/q1d0gdb9",
    spool_manychat: "https://spool.onelink.me/c5xQ/99xx9vdy",
    sean_manychat: "https://spool.onelink.me/c5xQ/3yu1dta4",
    spool_bio: "https://spool.onelink.me/c5xQ/3uxzx1hc",
    sean_bio: "https://spool.onelink.me/c5xQ/tnykj47a",
    alexis_bio: "https://spool.onelink.me/c5xQ/6ezr2f75",
    peyton_bio: "https://spool.onelink.me/c5xQ/tom6a7gl",
    peyton_dm: "https://spool.onelink.me/c5xQ/ponklr9l",
    simon_bio: "https://spool.onelink.me/c5xQ/rcqriaq7",
    simon_dm: "https://spool.onelink.me/c5xQ/rayxcnkh",
  },
  
  // Waitlist link (when app is not live)
  WAITLIST_URL: "https://spool-app.vercel.app/",
  
  // Text content for different modes
  DOWNLOAD_MODE: {
    header_button: "Download App",
    hero_button: "Download Now",
    hero_status: "📱 NOW AVAILABLE ON THE APP STORE!",
    cta_button: "Download Free on iOS",
    popup_title: "🎉 Spool is Now Live!",
    popup_text: "The wait is over! Download Spool now and start your journey to mindful phone use.",
    popup_button: "Download Now"
  },
  
  WAITLIST_MODE: {
    header_button: "Join Waitlist",
    hero_button: "Join Waitlist",
    hero_status: "📱 COMING SOON - JOIN THE WAITLIST!",
    cta_button: "Join the Waitlist",
    popup_title: "🧵 Join the Spool Waitlist",
    popup_text: "Be the first to experience mindful phone use. Get early access when Spool launches!",
    popup_button: "Join Waitlist"
  }
};

// Helper function to get current config
export const getCurrentConfig = () => {
  return APP_CONFIG.IS_APP_LIVE ? APP_CONFIG.DOWNLOAD_MODE : APP_CONFIG.WAITLIST_MODE;
};

// Helper function to get current URL
export const getCurrentURL = () => {
  return APP_CONFIG.IS_APP_LIVE ? APP_CONFIG.APP_STORE_URL : APP_CONFIG.WAITLIST_URL;
};
