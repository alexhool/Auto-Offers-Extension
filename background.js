/*
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: Copyright 2024-2025 Alexander Hool
 */

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "reloadAmex" && request.url) {
        chrome.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
                if (tab.url && tab.url.startsWith(request.url)) {
                    const tabId = tab.id;
                    chrome.tabs.reload(tabId);
                    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
                        if (updatedTabId === tabId && changeInfo.status === "complete") {
                            chrome.tabs.onUpdated.removeListener(listener);
                            setTimeout(() => {
                                chrome.tabs.sendMessage(tabId, { "action": "continueAmex" });
                            }, 5000);
                        }
                    });
                    break;
                }
            }
        });
    }
}); 
