async function closeOldTabs() {
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000; // 24h

  const tabs = await chrome.tabs.query({});
  const idsToClose = tabs
    .filter(
      (tab) =>
        tab.id != null &&
        !tab.pinned &&
        typeof tab.lastAccessed === "number" &&
        tab.lastAccessed < cutoff
    )
    .map((tab) => tab.id);

  if (idsToClose.length === 0) return;

  await Promise.allSettled(idsToClose.map((id) => chrome.tabs.remove(id)));
  console.log(`Closed ${idsToClose.length} old tab(s).`);
}

async function ensureCleanupAlarm() {
  const alarm = await chrome.alarms.get("cleanup");
  if (!alarm) {
    chrome.alarms.create("cleanup", { periodInMinutes: 5 });
    console.log("Created cleanup alarm (every 5 minutes).");
  }
}

chrome.runtime.onInstalled.addListener(() => {
  ensureCleanupAlarm().catch(console.error);
  closeOldTabs().catch(console.error);
});

chrome.runtime.onStartup.addListener(() => {
  ensureCleanupAlarm().catch(console.error);
  closeOldTabs().catch(console.error);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cleanup") {
    closeOldTabs().catch(console.error);
  }
});
