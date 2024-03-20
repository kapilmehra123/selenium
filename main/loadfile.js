const {
    By,
    Key,
    until
} = require('selenium-webdriver');
const {
    driver
} = require('./index')
async function scrollToElement(driver, element) {
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });", element);
}
async function waitUntilClickable(driver, locator, timeout = 10000) {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(async () => {
        const isClickable = await element.isEnabled();
        return isClickable;
    }, timeout);
    return element;
}
async function actionWithRetry(driver, actionFunction, locator, maxRetries = 3, timeout = 20000, overlayLocator) {
    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            console.log(new Date(), `retry: ${retry}`);
            const element = await waitUntilClickable(driver, locator, timeout);
            await actionFunction(element);
            // const element = await driver.wait(until.elementIsVisible(driver.findElement(locator)), timeout);
            //await actionFunction(element);
            return;
        } catch (error) {
            console.log(new Date(), ':error', error);
            if (error.name === 'StaleElementReferenceError') {
                console.error(new Date(), `StaleElementReferenceError: Attempt ${retry + 1} failed: ${error.message}`);
                const element = await driver.findElement(locator);
                await scrollToElement(driver, element);
                continue;
            } else if (error.name === 'TimeoutError') {
                console.error(new Date(), `TimeoutError: Attempt ${retry + 1} timed out: ${error.message}`);
                // const element = await driver.findElement(locator);
                // await scrollToElement(driver, element);
            } else if (error.name === 'ElementClickInterceptedError') {
                console.error(new Date(), `ElementClickInterceptedError: Attempt ${retry + 1} failed: Element click intercepted`);
                // await driver.sleep(4000);
            } else {
                // await driver.sleep(4000);
                console.error(new Date(), `Attempt ${retry + 1} failed with an unexpected error: ${error.message}`);
                throw error;
            }
        }
    }
    console.log(':after')
    throw new Error(`Action failed after ${maxRetries} attempts`);
}

function log(str){
    console.log(new Date(), str)
}

module.exports = {
    actionWithRetry,
    log
};