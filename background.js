const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function closeInactiveTabs() {
  const tabs = await browser.tabs.query({});
  const now = Date.now();

  for (const tab of tabs) {
    if (!tab.active && now - tab.lastAccessed > MAX_AGE_MS) {
      try {
        await browser.tabs.remove(tab.id);
      } catch (err) {
        console.warn(`Could not close tab ${tab.id}: ${err}`);
      }
    }
  }
}

// Handle alarm
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup-tabs') {
    closeInactiveTabs();
  }
});

// Set or reset alarm on startup
browser.runtime.onStartup.addListener(() => {
  browser.alarms.create('cleanup-tabs', {
    delayInMinutes: 1,
    periodInMinutes: 60,
  });
});

// Also initialize when installed
browser.runtime.onInstalled.addListener(() => {
  browser.alarms.create('cleanup-tabs', {
    delayInMinutes: 1,
    periodInMinutes: 60,
  });
});
