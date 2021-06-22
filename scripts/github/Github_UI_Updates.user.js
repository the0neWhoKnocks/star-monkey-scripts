// ==UserScript==
// @name         GitHub UI Updates
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Updates the GitHub UI to bring in some needed features.
// @author       Trevor Lemon
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @grant        none
// 
// @require      https://github.com/the0neWhoKnocks/star-monkey-scripts/raw/master/scripts/github/Github_UI_Updates.user.js
// @require      file://<REPO_PATH>/scripts/github/Github_UI_Updates.user.js
// ==/UserScript==

const basename = (str) => {
  let base = str.substring(str.lastIndexOf('/') + 1); 
  return base;
};
const dirname = (str) => {
  let dir = str.substring(0, str.lastIndexOf('/') + 1); 
  return dir;
};

async function renderPRListUpdates() {
  const ID__FILTERS = 'tamperedFilters';
  const URL = `https://github.com${location.pathname.split('/pulls')[0]}/pulls`;
  const FILTER__PR = 'is%3Apr';
  const FILTER__PR__CLOSED = 'is%3Aclosed';
  const FILTER__PR__MERGED = 'is%3Amerged';
  const FILTER__PR__OPEN = 'is%3Aopen';
  const LS_KEY = 'tamperMonkey.ghUsers';
  const alreadyAdded = document.getElementById(ID__FILTERS);
  
  if (!alreadyAdded) {
    document.head.insertAdjacentHTML('beforeend', `
      <style id="tamperedStyles">
        [aria-label="Issues"] a[href*="author"] {
          height: 2em;
          font-size: 1.25em;
          font-weight: bold;
          padding: 2px 8px 2px 2px;
          border: solid 1px;
          border-radius: 1em;
          display: inline-flex;
          align-items: center;
          vertical-align: top;
        }
        [aria-label="Issues"] a[href*="author"] img {
          height: 100%;
          border-radius: 100%;
          margin-right: 0.5em;
          display: inline-block;
        }

        .tampered__filters {
          padding: 0.25em 0;
          border: solid 1px var(--color-input-border);
          border-radius: 0.5em;
          background-color: var(--color-input-contrast-bg);
        }
        .tampered__filters a {
          color: var(--color-text-primary);
          text-decoration: none;
          padding: 0.25em 1em;
          border: solid 1px var(--color-input-border);
          border-radius: 0.5em;
          margin: 0 0.25em;
          background-color: var(--color-text-inverse);
          display: inline-block;
        }
        .tampered__filters a:hover:not(.current) {
          border-color: var(--color-text-primary);
        }
        .tampered__filters a.current {
          color: var(--color-input-border);
          background-color: var(--color-text-secondary);
        }
      </style>
    `);

    const searchBarEl = document.querySelector('.repository-content [role="search"]').parentElement;
    const filterBtns = [
      ['Open', FILTER__PR__OPEN],
      ['Merged', FILTER__PR__MERGED],
      ['Closed', FILTER__PR__CLOSED],
    ];

    searchBarEl.insertAdjacentHTML('afterend', `
      <nav id="${ID__FILTERS}" class="tampered__filters">
        ${filterBtns.map(([label, filter]) => {
          let _class = '';
          if (location.search.includes(filter) || label === 'Open' && !location.search) _class = 'current';
          return `<a href="${URL}?q=${FILTER__PR}+${filter}" class="${_class}">${label}</a>`;
        }).join('')}
      </nav>
    `);
    
    const userEls = [...document.querySelectorAll('[aria-label="Issues"] a[href*="author"]')];
    let cachedUserData = {};
    if (localStorage[LS_KEY]) {
      cachedUserData = JSON.parse(localStorage[LS_KEY]);
    }
    
    const pendingData = userEls
      .map(({ dataset: { hovercardUrl }, textContent: username }) => ({ hovercardUrl, username }))
      .reduce((arr, obj) => {
        let exists = false;
        for (let i=0; i<arr.length; i++) {
          if (arr[i].username === obj.username) {
            exists = true;
            break;
          }
        }
        if (!exists && obj.hovercardUrl) arr.push(obj);
        return arr;
      }, [])
      .map(async ({ hovercardUrl, username }) => {
        if (cachedUserData[username]) return {};

        const request = new Request(`https://github.com${hovercardUrl}`, {});
        request.headers.append('X-Requested-With', 'XMLHttpRequest');

        const htmlStr = await fetch(request).then(resp => resp.text());
        const tempEl = document.createElement('div');
        tempEl.innerHTML = htmlStr;
        return {
          [username]: {
            avatarURL: tempEl.querySelector('.avatar-user').src,
          },
        };
      });
    const dataObj = (await Promise.all(pendingData)).reduce((obj, data) => ({ ...obj, ...data }), {});
    
    const userData = {
      ...cachedUserData,
      ...dataObj,
    };
    localStorage[LS_KEY] = JSON.stringify(userData);
    
    userEls.forEach((el) => {
      const { textContent: username } = el;
      if (userData[username]) el.innerHTML = `<img src="${userData[username].avatarURL}" />${username}`;
    });
    
    console.log('[PULLS] Rendered');
  }
  
  const clearEl = document.querySelector('.issues-reset-query-wrapper');
  if (clearEl) clearEl.remove();
}

function renderPRConvoUpdates() {
  const ID__JIRA_TICKETS = 'tamperedJiraTickets';
  const alreadyAdded = document.getElementById(ID__JIRA_TICKETS);
  const sidebarEl = document.getElementById('partial-discussion-sidebar');
  const titleEl = document.querySelector('.gh-header-title .markdown-title');
  const ticketRegEx = /^(\w{3,4}-\d{0,4})/g;
  const origTitle = titleEl.innerText.trim();
  const tickets = origTitle.match(ticketRegEx);

  if (!alreadyAdded && tickets && tickets.length) {
    sidebarEl.insertAdjacentHTML('afterbegin', `
      <style>
        .jira-link, .jira-link:hover {
          color: var(--color-text-link);
          font-weight: bold;
          text-decoration: none;
          padding: 0.25em 0.5em;
          border: solid 1px;
          border-left-width: 8px;
          border-color: var(--color-box-border-info);
          border-radius: 0.25em;
          background: var(--color-box-bg-info);
          display: block;
        }
      </style>
      <div id="${ID__JIRA_TICKETS}" class="discussion-sidebar-item">
        <div class="text-bold discussion-sidebar-heading">Jira Ticket(s)</div>
        ${tickets.map(ticket => {
          return `<a class="jira-link" href="https://jira.nike.com/browse/${ticket}" target="_blank">${ticket}</a>`;
        }).join('')}
      </div>
    `);
    
    console.log('[PULL] Tickets found, rendered link(s)');
  }
}

function renderDiffListing() {
  const diffViewEl = document.querySelector('.js-diff-container');
  const changedFiles = [...document.querySelectorAll('.file-header')].map(el => {
    const { anchor, fileDeleted, path } = el.dataset;
    return {
      anchor,
      deleted: fileDeleted === 'true',
      el: el.closest('.js-file'),
      path,
    };
  });
  
  const dirData = changedFiles.reduce((obj, { anchor, deleted, path }) => {
    const parentPath = dirname(path);
    const file = basename(path);

    if (parentPath && file) {
      // create nested folders
      let currFolder;
      const _folders = parentPath.split('/').filter(p => !!p);
      
      _folders.forEach((_path, ndx) => {
        const isFolder = !!_folders[ndx + 1];
        const container = { __files__: [], __folders__: {} };
        
        if (!currFolder) {
          if (!obj.__folders__[_path]) obj.__folders__[_path] = container;
          currFolder = obj.__folders__[_path];
        }
        else {
          if (!currFolder[_path]) currFolder[_path] = container;
          currFolder = currFolder[_path];
        }
        
        currFolder = isFolder ? currFolder.__folders__ : currFolder.__files__;
      });
      
      if (Array.isArray(currFolder)) currFolder.push({ anchor, deleted, filename: file });
    }
    else {
      obj.__files__.push({ anchor, deleted, filename: file });
    }
    
    return obj;
  }, { __files__: [], __folders__: {} });
  
  const renderFiles = (files) => {
    let str = '';
    files.forEach(({ anchor, deleted = '', filename }) => {
      str += `<file ${deleted ? 'deleted' : ''}><a href="#${anchor}">${filename}</a></file>`;
    });
    return str;
  };
  
  let markup = '';
  const iterateFolders = ({ __files__, __folders__ }) => {
    let _markup = '';
    
    Object.keys(__folders__).forEach((folder) => {
      _markup += `<folder opened data-path=" ${folder}/">${iterateFolders(__folders__[folder])}</folder>`;
    });
    
    if (__files__.length) _markup += renderFiles(__files__);
    
    return _markup;
  };
  markup += iterateFolders(dirData);
  
  const dirListEl = document.querySelector('dir-list');
  if (!dirListEl) {
    diffViewEl.insertAdjacentHTML('afterbegin', `
      <style>
        .diff-view {
          display: flex;
        }
        
        dir-list,
        divider {
          align-self: flex-start; /* allow for sticky in a flex container */
          top: 0px;
          position: sticky;
        }
        .pr-toolbar ~ .diff-view dir-list,
        .pr-toolbar ~ .diff-view divider {
          top: 60px;
        }
        
        dir-list,
        divider {
          height: 100vh;
        }
        .pr-toolbar ~ .diff-view dir-list,
        .pr-toolbar ~ .diff-view divider {
          height: calc(100vh - 60px);
        }

        dir-list {
          width: 20%;
          overflow: auto;
          padding: 1em 2em 1em 1em;
          flex-shrink: 0;
        }
        diffs {
          width: 77%;
          flex-grow: 1;
        }
        .diff-view.dir-list--closed dir-list {
          display: none;
        }

        dir-list folder {
          display: block;
          user-select: none;
        }
        dir-list folder[closed] > * {
          display: none;
        }
        dir-list folder::before {
          white-space: nowrap;
          cursor: pointer;
          display: block;
        }
        dir-list folder[opened]::before {
          content: '- \\01F4C2' attr(data-path);
        }
        dir-list folder[closed]::before {
          content: '+ \\01F4C2' attr(data-path);
        }

        dir-list file {
          user-select: all;
          white-space: nowrap;
          display: block;
        }
        dir-list file::before {
          content: '\\01F4C4';
          padding-right: 0.25em;
          display: inline-block;
        }
        dir-list file[deleted] a {
          color: red;
          text-decoration: line-through;
        }

        folder > folder,
        folder file {
          margin-left: 1em;
        }
        
        divider {
          width: 3em;
          cursor: pointer;
          flex-shrink: 0;
        }
        divider::before {
          content: '';
          width: 1px;
          height: 100%;
          background: #ccc;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        divider::after {
          content: '\\2039';
          font-size: 1.5em;
          padding: 0.25em;
          border: solid 1px #ccc;
          border-radius: 0.5em;
          background: #fff;
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .diff-view.dir-list--closed divider::after {
          content: '\\203A';
        }
      </style>
      <dir-list>${markup}</dir-list>
      <divider></divider>
      <diffs></diffs>
    `);
    
    const diffsEl = document.querySelector('diffs');
    [...document.querySelectorAll('.js-diff-progressive-container')].forEach((el) => {
      diffsEl.appendChild(el);
    });
    
    // Sometimes diffs get added to other child elements after the first render,
    // perhaps for perfomance reasons. This should ensure that the file list is
    // current.
    const filesObserver = new MutationObserver(() => {
      renderDiffListing();
      filesObserver.disconnect();
    });
    filesObserver.observe(
      diffsEl,
      { attributes: false, childList: true, subtree: true }
    );
    
    document.querySelector('dir-list').addEventListener('click', ({ target }) => {
      if (target.nodeName === 'FOLDER') {
        if (target.hasAttribute('opened')) {
          target.removeAttribute('opened');
          target.setAttribute('closed', '');
        }
        else {
          target.removeAttribute('closed');
          target.setAttribute('opened', '');
        }
      }
    });
    
    document.querySelector('divider').addEventListener('click', () => {
      if (diffViewEl.classList.contains('dir-list--closed')) {
        diffViewEl.classList.remove('dir-list--closed');
      }
      else {
        diffViewEl.classList.add('dir-list--closed');
      }
    });
  }
  else {
    dirListEl.innerHTML = markup;
  }
}

function renderPRFilesUpdates() {
  renderDiffListing();
  console.log('[PULL] files rendered');
}

function renderCompareUpdates() {
  renderDiffListing();
  console.log('[COMPARE] rendered');
}

function renderPRCommitsUpdates() {
  renderDiffListing();
  console.log('[COMMITS] rendered');
}

function render() {
  if (location.pathname.includes('/pulls')) renderPRListUpdates();
  else if (/\/pull\/\d+$/.test(location.pathname)) renderPRConvoUpdates();
  else if (/\/pull\/\d+\/commits\/.*$/.test(location.pathname)) renderPRCommitsUpdates();
  else if (/\/pull\/\d+\/files$/.test(location.pathname)) renderPRFilesUpdates();
  else if (/\/compare\/.*$/.test(location.pathname)) renderCompareUpdates();
}

(function() {
  const dynamicEl = document.getElementById('js-repo-pjax-container');
  
  if (dynamicEl) {
    const observer = new MutationObserver(() => {
      render();
    });
    observer.observe(
      dynamicEl,
      { attributes: false, childList: true, subtree: false }
    );

    render();
  }
})();
