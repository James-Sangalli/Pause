document.addEventListener("DOMContentLoaded", () => {

    const meditatedTodayMsg = "You've been mindful today";
    const notMeditatedTodayMsg = "Please remember to be mindful today, take some time to meditate now";

    function displayStreak() {
        chrome.storage.sync.get("streak", (result) => {
            if(result.streak === 1) {
                document.getElementById("dailyStreak").innerText = `You've been consistently mindful for ${result.streak} day`;
            } else {
                document.getElementById("dailyStreak").innerText = `You've been consistently mindful for ${result.streak} days`;
            }
        });
    }

    getMeditatedToday().then((meditatedToday) => {
        if(meditatedToday) {
            document.getElementById("status").innerText = meditatedTodayMsg;
        } else {
            document.getElementById("status").innerText = notMeditatedTodayMsg;
        }
    }).catch(console.error);

    function play() {
        new Audio('./ping.wav').play();
    }

    function done(meditatedToday, streak) {
        play();
        if (!meditatedToday) {
            chrome.storage.sync.set({streak: streak + 1, lastMeditationDay: new Date().setHours(0,0,0,0)});
            sendMsgComplete();
            displayStreak();
        }
        document.getElementById("status").innerText = meditatedTodayMsg;
        document.getElementById("timer").hidden = true;
    }

    function saveThoughts() {
        const thoughts = document.getElementById("thoughts").innerText;
        localStorage.setItem(new Date().toLocaleDateString(), thoughts);
    }

    document.getElementById("thoughtHistory").innerText = JSON.stringify(localStorage);

    const meditate = async () => {
        document.getElementById("timer").hidden = false;
        const meditationTimeSet = await promisifiedChromeGet("meditationTimeSet");
        const streak = await promisifiedChromeGet("streak");
        const meditatedToday = await getMeditatedToday();
        startTimer(meditationTimeSet / 1000);
        setTimeout(() => {
            done(meditatedToday, streak);
        }, meditationTimeSet);
    };

    document.getElementById("meditate").addEventListener("click", meditate);

    displayStreak();

});