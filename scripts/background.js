chrome.alarms.get("init", function(alarm) {

    var alarmDetails = { when: Date.now(), periodInMinutes: 1 };

    if (typeof alarm === "undefined") {
        chrome.alarms.create("init", alarmDetails);
    }

    chrome.alarms.getAll(function(alarms) {
        if (alarms.length > 1) {
            chrome.alarms.clearAll(function(wasCleared) {
                chrome.alarms.create("init", alarmDetails);
            });
        }
    });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("alarm fired");
    init();
});

function checkResponse(data) {

    var pm = $(data).find("#pm_notice");
    if (pm.length > 0)
        initAddPM(pm);

}

function init() {
    var url = "http://hackforums.net/usercp.php";

    $.get(url, function(data) {
        checkResponse(data);
    });
}

function initAddPM(pm) {

    var pmid = pm.find("a[href*='private.php?action=read']").attr("href").substr(29);
    chrome.storage.local.get("pmid", function(items) {
        if (pmid == items.pmid) {
            console.log("returned false");
            return false;
        } else {
            addPM(pm, pmid);
        }
    });
}

function addPM(pm, pmid) {

    var author = pm.find("a[href*='member.php']").html();
    var title = pm.find("a[href*='private.php?action=read']").html();

    var urlBase = "http://hackforums.net/";
    var urlPage = pm.find("a[href*='private.php?action=read']").attr("href");
    var url = urlBase + urlPage;

    chrome.storage.local.set({pmid: pmid});

    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/pm_512.png",
        title: "You have a new PM",
        message: "You received a new PM from " + author + " titled " + title +
        ". Click on the notification to read it."
    });

    chrome.notifications.onClicked.addListener(function(nId, user) {
        chrome.tabs.create({url: url}, function(tab) {
            addNotif(-1);
        });
    });

    addNotif(1);
}

function addNotif(type) {
    chrome.browserAction.getBadgeText({}, function(notif_count) {
        if (type === 1) {
            if (notif_count === "")
                notif_count = 0;

            notif_count++;
            chrome.browserAction.setBadgeText ({ text: String(notif_count) });
        }
        else {
            if (notif_count === "1")
                notif_count = "";
            else
                notif_count--;

            chrome.browserAction.setBadgeText ({ text: String(notif_count) });
        }
    });
}