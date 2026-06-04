const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const htmlPath = path.resolve(__dirname, '../test_image.html');
        await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

        // Ensure viewport covers the element
        await page.setViewport({ width: 900, height: 1000, deviceScaleFactor: 2 });

        // Wait an extra second for web fonts
        await new Promise(r => setTimeout(r, 2000));

        const element = await page.$('#capture');
        await element.screenshot({ path: path.resolve(__dirname, '../journey_of_trader.png') });

        console.log('Screenshot saved to journey_of_trader.png');
        await browser.close();
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
})();
