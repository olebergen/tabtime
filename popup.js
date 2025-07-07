const cutoff = {
  12: 12 * 60 * 60 * 1000,
  6: 6 * 60 * 60 * 1000,
  1: 60 * 60 * 1000,
};

function getTabCategory(lastAccessed, now) {
  if (lastAccessed < now - cutoff[12]) return 'olderThan12';
  if (lastAccessed < now - cutoff[6]) return 'olderThan6';
  if (lastAccessed < now - cutoff[1]) return 'olderThan1';
  return 'lessThan1';
}

const containers = {
  olderThan12: document.getElementById('tabs-twelve-hours'),
  olderThan6: document.getElementById('tabs-six-hours'),
  olderThan1: document.getElementById('tabs-one-hour'),
  lessThan1: document.getElementById('tabs-fresh'),
};

function updateTabsList() {
  chrome.tabs.query({}, (tabs) => {
    for (const container of Object.values(containers)) {
      container.innerHTML = '';
    }

    for (const tab of tabs) {
      if (tab.id == null || tab.pinned || !tab.lastAccessed) continue;

      const tabElement = document.createElement('div');

      const now = Date.now();

      tabElement.className = 'tab';
      tabElement.textContent = tab.title || tab.url;

      const category = getTabCategory(tab.lastAccessed, now);

      containers[category].appendChild(tabElement);

      tabElement.addEventListener('click', () => {
        chrome.tabs.remove(tab.id);
      });
    }
  });
}

chrome.tabs.onRemoved.addListener(() => {
  updateTabsList();
});

updateTabsList();
