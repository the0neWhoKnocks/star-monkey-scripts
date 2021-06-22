// ==UserScript==
// @name         Sticky Jenkins nav
// @version      1.0.0
// @description  Pins the build nav to the top so you don't have to scroll to the top to view status or cancel the build.
// @author       Trevor Lemon
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @include      /^https:\/\/.*jenkins.*\.com\/job\/.*\/console/
// @grant        none
// 
// @require      https://github.com/the0neWhoKnocks/star-monkey-scripts/raw/master/scripts/jenkins/Sticky_Jenkins_nav.user.js
// @require      file://<REPO_PATH>/scripts/jenkins/Sticky_Jenkins_nav.user.js
// ==/UserScript==

(() => {
  const breadcrumbs = document.querySelector('.top-sticker');
  const top = (breadcrumbs) ? `${breadcrumbs.offsetHeight}px` : 0;

  document.querySelector('.build-caption.page-headline').style.cssText = `
    position: sticky;
    top: ${top};
    background: #fff;
    padding: 0.25em 3em 0.25em 1em;
    max-width: none;
  `;
})();
