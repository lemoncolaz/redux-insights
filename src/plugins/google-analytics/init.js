function init(trackingID) {
  if (typeof window === "undefined") {
    // running on the server
    return Promise.reject();
  } else {
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }), (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "https://www.google-analytics.com/analytics.js",
      "ga"
    );

    ga("create", trackingID, "auto");

    // Uses ga's readyCallback to resolve promise with tracker
    return new Promise(ga);
  }
}

export default init;
