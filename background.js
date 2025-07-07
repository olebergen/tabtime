function closeOldTabs() {
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000;

  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id != null && !tab.pinned && tab.lastAccessed && tab.lastAccessed < cutoff) {
        console.log(`Closing tab ${tab.id} (${tab.url})`);
        chrome.tabs.remove(tab.id);
      }
    }
  });
}

closeOldTabs();

chrome.alarms.get('cleanup', (alarm) => {
  if (!alarm) chrome.alarms.create('cleanup', { periodInMinutes: 5 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') closeOldTabs();
});
