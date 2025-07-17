const container = document.getElementById('container');

function updateTabsList() {
  chrome.tabs.query({}, (tabs) => {
    container.innerHTML = '';

    for (const tab of tabs) {
      if (tab.id == null || tab.pinned || !tab.lastAccessed) continue;

      const tabListItem = document.createElement('li');
      tabListItem.className = 'tab';

      const tabTime = Date.now() - tab.lastAccessed;
      const tabTimeHours = Math.floor(tabTime / 1000 / 60 / 60);

      const tabTimeLabel = document.createElement('div');
      tabTimeLabel.className = 'tab-time';
      tabTimeLabel.textContent =
        tabTimeHours === 0 ? '<1' : tabTimeHours < 10 ? ' ' + tabTimeHours : tabTimeHours;
      tabListItem.appendChild(tabTimeLabel);

      const tabTimeTitle = document.createElement('div');
      tabTimeTitle.textContent = tab.title || tab.url;
      tabListItem.appendChild(tabTimeTitle);

      container.appendChild(tabListItem);

      tabListItem.addEventListener('click', () => {
        chrome.tabs.remove(tab.id);
      });
    }
  });
}

chrome.tabs.onRemoved.addListener(() => {
  updateTabsList();
});

updateTabsList();
