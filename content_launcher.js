(async () => {
  const src = chrome.runtime.getURL('content.js');
  const contentScript = await import(src);
  window.onload = contentScript.main(/* chrome: no need to pass it */);
  
})();