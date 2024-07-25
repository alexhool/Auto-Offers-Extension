chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addAmexOffers" || request.action === "continueAmex") {
        addAmexOffers().then(() => {
            sendResponse();
        }).catch(error => {
            console.error(error);
            sendResponse();
        });
        return true;
    } else if (request.action === "addRakutenOffers") {
        addRakutenOffers().then(() => {
            sendResponse();
        }).catch(error => {
            console.error(error);
            sendResponse();
        });
        return true;
    }
});


async function addAmexOffers() {
    let needsToReload = false;
    let addButtons = Array.from(document.querySelectorAll(".offer-cta"))
        .filter(button => button.textContent.trim() === "Add to Card");
    while (addButtons.length > 0) {
        needsToReload = true;
        addButtons.pop().click();
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 2000));
    }
    if (needsToReload) {
        chrome.runtime.sendMessage({ "action": "reloadAmex", "url": window.location.href });
    } else {
        chrome.runtime.sendMessage({ "status": "completed", "action": "addAmexOffers" });
        alert("Completed! - No more offers to add.");
    }
}

async function addRakutenOffers() {
    async function clickSeeMoreButtons() {
        let seeMoreButtons = Array.from(document.querySelectorAll(".chakra-button.css-1an2tts"))
            .filter(button => button.textContent.trim() === "See More");
        while (seeMoreButtons.length > 0) {
            seeMoreButtons.pop().click();
            await new Promise(r => setTimeout(r, Math.random() * 1000 + 2000));
            await clickSeeMoreButtons();
        }
    }
    async function clickAddButtons() {
        let addButtons = Array.from(document.querySelectorAll(".chakra-button"))
            .filter(button => button.textContent.trim() === "Add" && !button.disabled);
        while (addButtons.length > 0) {
            addButtons.pop().click();
            await new Promise(r => setTimeout(r, Math.random() * 1000 + 6000));
        }
    }
    await clickSeeMoreButtons();
    await clickAddButtons();
    chrome.runtime.sendMessage({ "status": "completed", "action": "addRakutenOffers" });
    alert("Completed! - No more offers to add.");
}
