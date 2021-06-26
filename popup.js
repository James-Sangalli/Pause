document.addEventListener("DOMContentLoaded", () => {

  async function init() {
    const meditationReminderTime = await promisifiedChromeGet("currentReminderTime");
    const meditatedToday = await getMeditatedToday();
    await checkDailyStreak();
    const streak = await promisifiedChromeGet("streak");
    document.getElementById("dailyStreak").innerText = `Current daily streak: ${streak}`;
    const timeToday = new Date().getHours();
    if(meditationReminderTime >= timeToday || !meditatedToday) {
      document.getElementById("meditatedToday").innerText = `you are due for a meditation!`;
    } else {
      chrome.runtime.sendMessage({})
      document.getElementById("meditatedToday").innerText = `You have meditated today, congrats!`;
    }
  }

  init().catch(console.error);

  let meditateNowButton = document.getElementById("meditateNow");
  let guidedMeditationButton = document.getElementById("guidedMeditation");
  let settings = document.getElementById("settings");

  meditateNowButton.addEventListener("click", () => {
    openTab("meditate.html");
  });

  guidedMeditationButton.addEventListener("click",  () => {
    openTab("guidedMeditation.html");
  });

  settings.addEventListener("click",  () => {
    openTab("options.html");
  });

  const openTab = (pageName) => {
    console.log(`opening a new ${pageName} tab`);
    chrome.tabs.create({url: pageName});
  }

});

