(function () {
  var currentScript = document.currentScript;

  if (!currentScript) {
    return;
  }

  var scriptUrl = new URL(currentScript.src, window.location.href);
  var measurementId = scriptUrl.searchParams.get('id');

  if (!measurementId) {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
})();
