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
    let failedOffers = 0;
    async function clickCloseButton() {
        const initialCloseButton = document.querySelector('.chakra-modal__close-btn.css-338l4');
        if (initialCloseButton) {
            initialCloseButton.click();
            await new Promise(r => setTimeout(r, Math.random() * 1000 + 2000));
        }
    }
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
            const addButton = addButtons.pop();
            let retries = 3;
            while (retries > 0) {
                addButton.click();
                await new Promise(r => setTimeout(r, Math.random() * 1000 + 2000));
                const popupCloseButton = document.querySelector('.chakra-modal__close-btn.css-5vo0te');
                if (popupCloseButton) {
                    popupCloseButton.click();
                    await new Promise(r => setTimeout(r, Math.random() * 1000 + 2000));
                    retries--;
                    if (retries === 0) {
                        failedOffers++;
                    }
                } else {
                    await new Promise(r => setTimeout(r, Math.random() * 1000 + 4000));
                    break;
                }
            }
        }
    }
    await clickCloseButton();
    await clickSeeMoreButtons();
    await clickAddButtons();
    chrome.runtime.sendMessage({ "status": "completed", "action": "addRakutenOffers" });
    if (failedOffers == 0) {
        alert("Completed! - All offers successfully added.");
    } else if (failedOffers == 1) {
        alert(`Completed! - ${failedOffers} offer could not be added.`);
    } else {
        alert(`Completed! - ${failedOffers} offers could not be added.`);
    }
}