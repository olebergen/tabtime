function closeOldTabs() {
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000; // 24 hours

  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.lastAccessed && tab.lastAccessed < cutoff) {
        chrome.tabs.remove(tab.id);
      }
    }
  });
}

closeOldTabs();

chrome.alarms.create('cleanup', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') closeOldTabs();
});
