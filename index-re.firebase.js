(function(){
  function loadScript(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed: " + src));
      document.head.appendChild(s);
    });
  }
  // After all gstatic scripts run, check if firebase is loaded.
  // If NOT, try jsdelivr fallback CDN.
  window._fbReady = new Promise((resolve) => {
    if(typeof firebase !== "undefined"){
      console.log("✓ Firebase loaded via gstatic");
      resolve(true);
      return;
    }
    console.warn("Firebase not on gstatic — trying jsdelivr fallback...");
    loadScript("https://cdn.jsdelivr.net/npm/firebase@8.10.1/firebase-app.js")
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/firebase@8.10.1/firebase-database.js"))
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/firebase@8.10.1/firebase-storage.js"))
      .then(() => {
        if(typeof firebase !== "undefined"){
          console.log("✓ Firebase loaded via jsdelivr");
          resolve(true);
        } else {
          console.error("Firebase failed to load from both CDNs");
          resolve(false);
        }
      })
      .catch(err => {
        console.error("Fallback failed:", err);
        resolve(false);
      });
  });
})();
