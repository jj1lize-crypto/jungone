(function(){
  try{
    var p = new URLSearchParams(window.location.search);
    var m = p.get("mode") || "public";
    document.documentElement.classList.add("html-mode-" + m);
  }catch(e){}
})();

/* Lock the app height to the ACTUAL visible viewport.
   iOS Safari mis-reports 100dvh (toolbars overlap content), so we measure
   window.innerHeight directly — reliable in Safari, Chrome, and TV browsers. */
(function(){
  function setAppVH(){
    document.documentElement.style.setProperty("--app-vh", window.innerHeight + "px");
  }
  setAppVH();
  window.addEventListener("resize", setAppVH);
  window.addEventListener("orientationchange", function(){ setTimeout(setAppVH, 250); });
  if(window.visualViewport){ window.visualViewport.addEventListener("resize", setAppVH); }
})();
