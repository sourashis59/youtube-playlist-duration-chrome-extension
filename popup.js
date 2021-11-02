"use strict";

console.log("popup script hein ?");

const playlistDetailContainer = document.getElementById(
    "playlistDetailContainer"
);
const fetchingDetails = document.getElementById("fetchingDetails");
const playlistDetail = document.getElementById("playlistDetail");
const invalidURL = document.getElementById("invalidURL");
const apiKeyQuotaExceeded = document.getElementById("apiKeyQuotaExceeded");

const resultContainers = document.getElementsByClassName("resultContainer");

function hideAllResultContainers() {
    for (let i = 0; i < resultContainers.length; i++) {
        resultContainers[i].classList.add("hidden");
    }
}

function displayFetchingDetails() {
    for (let i = 0; i < resultContainers.length; i++) {
        if (resultContainers[i].id === "fetchingDetails")
            resultContainers[i].classList.remove("hidden");
        else resultContainers[i].classList.add("hidden");
    }
}

function displayInvalidURL() {
    for (let i = 0; i < resultContainers.length; i++) {
        if (resultContainers[i].id === "invalidURL")
            resultContainers[i].classList.remove("hidden");
        else resultContainers[i].classList.add("hidden");
    }
}

function displayAPIKeyQuotaExceeded() {
    for (let i = 0; i < resultContainers.length; i++) {
        if (resultContainers[i].id === "apiKeyQuotaExceeded")
            resultContainers[i].classList.remove("hidden");
        else resultContainers[i].classList.add("hidden");
    }
}

function displayPlaylistDetail({
    totalDuration,
    countTotalVid,
    countPublicVid,
}) {
    for (let i = 0; i < resultContainers.length; i++) {
        if (resultContainers[i].id === "playlistDetail")
            resultContainers[i].classList.remove("hidden");
        else resultContainers[i].classList.add("hidden");
    }

    document.querySelector("#totalVideCount").innerHTML = `${countTotalVid}`;
    document.querySelector("#publicVideoCount").innerHTML = `${countPublicVid}`;
    document.querySelector("#playlistDuration").innerHTML = `${totalDuration}`;
}

function updateResult(response) {
    if (response.status === "done" || response.status === "alreadyComputed") {
        displayPlaylistDetail({
            totalDuration: response.data.totalDurationString,
            playlistID: response.data.playlistID,
            countTotalVid: response.data.countTotalVid,
            countPublicVid: response.data.countPublicVid,
        });
    } else if (response.status === "notValidYouTubePlaylistURL") {
        displayInvalidURL();
    } else if (response.status === "quotaExceeded") {
        displayAPIKeyQuotaExceeded();
    } else {
        console.error("status not understood in updateResult() :|");
    }
}

//*Execution_______________________________________________________________________________________________

// displayFetchingDetails();

//*send message to content script asking for the total duration of the current youtube playlist
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // console.log("sending request from popup script");

    displayFetchingDetails();

    if (tabs[0]) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "sendDurationPlz:)",

            function (response) {
                //*at homepage the extension was showing chrome.runtime.lastError , but this error cant be caught . so added this corner case
                if (chrome.runtime.lastError) {
                    // console.log("chrome.runtime.lastError : ");
                    // console.log(chrome.runtime.lastError);

                    displayInvalidURL();
                    return;
                }

                //*now i know the current tab is not homemade
                // console.log("response : ");
                // console.log(response);

                updateResult(response);
            }
        );
    }
});
