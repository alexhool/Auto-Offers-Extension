/*
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: Copyright 2024-2025 Alexander Hool
 */

document.addEventListener("DOMContentLoaded", function () {
    const amexButton = document.getElementById("amexButton");
    const rakutenButton = document.getElementById("rakutenButton");

    amexButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            if (url.startsWith("https://global.americanexpress.com/offers/eligible")) {
                amexButton.classList.add("button--loading");
                chrome.tabs.sendMessage(tabs[0].id, { "action": "addAmexOffers" }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                        amexButton.classList.remove("button--loading");
                    }
                });
            } else {
                if (confirm("You are not on the American Express offers page. Do you want to open it in a new tab?")) {
                    chrome.tabs.create({ url: "https://global.americanexpress.com/offers/eligible" });
                }
            }
        });
    });

    rakutenButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            if (url.startsWith("https://www.rakuten.com/in-store")) {
                rakutenButton.classList.add("button--loading");
                chrome.tabs.sendMessage(tabs[0].id, { "action": "addRakutenOffers" }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                        rakutenButton.classList.remove("button--loading");
                    }
                });
            } else {
                if (confirm("You are not on the Rakuten in-store offers page. Do you want to open it in a new tab?")) {
                    chrome.tabs.create({ url: "https://www.rakuten.com/in-store" });
                }
            }
        });
    });

    chrome.runtime.onMessage.addListener((request) => {
        if (request.status === "completed") {
            if (request.action === "addAmexOffers") {
                amexButton.classList.remove("button--loading");
            } else if (request.action === "addRakutenOffers") {
                rakutenButton.classList.remove("button--loading");
            }
        }
    });
});
