document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("streak", (result) => {
    if (result.streak === 1) {
      document.getElementById("dailyStreak").innerText =
        `You've been consistently mindful for ${result.streak} day`;
    } else {
      document.getElementById("dailyStreak").innerText =
        `You've been consistently mindful for ${result.streak} days`;
    }
  });

  const confirmWatchedVideo = async () => {
    const meditatedToday = await getMeditatedToday();
    if (!meditatedToday) {
      alert("Thank you for meditating");
      const streak = await promisifiedChromeGet("streak");
      chrome.storage.sync.set({
        streak: streak + 1,
        lastMeditationDay: new Date().setHours(0, 0, 0, 0),
      });
    } else {
      alert("Nice, you have meditated more than once today");
    }
    sendMsgComplete();
  };

  document
    .getElementById("guidedMeditationWatched")
    .addEventListener("click", confirmWatchedVideo);
});
