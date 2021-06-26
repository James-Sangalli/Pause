chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ currentReminderTime: 12 }); // noon
    chrome.storage.sync.set({ streak: 0 });
    chrome.storage.sync.set({ meditationTimeSet: 120000 }); // 2 minutes in milliseconds
    chrome.storage.sync.set({ lastMeditationDay: 0 });
    setReminder().catch(console.error);
});

async function setReminder() {
    await chrome.alarms.clear('mindfulnessReminder');
    const reminderTime = await new Promise(function(resolve, reject) {
        chrome.storage.sync.get("currentReminderTime", function(result){
            resolve(result["currentReminderTime"]);
        });
    });
    chrome.alarms.create('mindfulnessReminder', {
        when: new Date().setHours(reminderTime)
    });
}

function setIconsReminder() {
    chrome.browserAction.setIcon({ path: {
        "16": "/images/PauseRed16x.png",
        "32": "/images/PauseRed32x.png",
        "48": "/images/PauseRed64x.png",
        "128": "/images/PauseRed128x.png"
    }});
}

function setIconsDefault() {
    chrome.browserAction.setIcon({ path: {
        "16": "/images/Pause16x.png",
        "32": "/images/Pause32x.png",
        "48": "/images/Pause64x.png",
        "128": "/images/Pause128x.png"
    }});
}

chrome.runtime.onMessage.addListener((req, action) => {
    if(action.message === "defaultIcons") {
        setIconsDefault();
    }
});

chrome.alarms.onAlarm.addListener(() => {
    setIconsReminder();
    setReminder().catch(console.error);
});
