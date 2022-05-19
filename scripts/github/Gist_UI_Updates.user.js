// ==UserScript==
// @name         Gist UI Updates
// @version      1.0.0
// @description  Updates the Gist UI to bring in some needed features.
// @author       Trevor Lemon
// @match        https://gist.github.com/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// 
// @require      https://github.com/the0neWhoKnocks/star-monkey-scripts/raw/master/scripts/github/Gist_UI_Updates.user.js
// @require      file:///<REPO_PATH>/scripts/github/Gist_UI_Updates.user.js
// ==/UserScript==

(() => {
  const fileHeaders = [...document.querySelectorAll('.file-header')];
  
  document.head.insertAdjacentHTML('beforeend', `
    <style id="tamperedStyles">
      .file-header__toggle {
        margin-left: 0.5em;
        order: 3;
      }
      
      .Box-body.is--closed {
        display: none;
      }
    </style>
  `);
  
  fileHeaders.forEach((header) => {
    header.insertAdjacentHTML('beforeend', `
      <button class="btn btn-sm file-header__toggle is--open" type="button">−</button>
    `);
  });
  
  document.querySelector('.gist-content').addEventListener('click', ({ target }) => {
    if (target.classList.contains('file-header__toggle')) {
      target.classList.toggle('is--open');
      
      const bodyEl = target.closest('.file-box').querySelector('.Box-body');
      if (target.classList.contains('is--open')) {
        bodyEl.classList.remove('is--closed');
        target.textContent = '−';
      }
      else {
        bodyEl.classList.add('is--closed');
        target.textContent = '+';
      }
    }
  });
})();
