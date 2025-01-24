require('dotenv').config();
const { loginKorail } = require('./login');
const { startReservation } = require('./reserve');
const puppeteer = require('puppeteer');
(async () => {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    let page = await browser.newPage();

    // 1) 로그인 로직
    try {
        const loginResult = await loginKorail(browser, page, {
            userId: process.env.USER_ID,
            userPw: process.env.USER_PW,
            headless: false,
        });
        browser = loginResult.browser;
        page = loginResult.page;
        console.log('[index.js] 로그인 완료');
    } catch (err) {
        console.error('[index.js] 로그인 과정에서 오류:', err);
        // 로그인 실패 시 바로 종료 (브라우저 닫기)
        process.exit(1);
    }

    // // 로그인 없이 예매 테스트
    // await page.goto('https://www.letskorail.com/', {
    //     waitUntil: 'networkidle2',
    //     timeout: 0,
    // });

    // 2) 예매 로직
    try {
        await startReservation(browser, page, '서울', '광주송정', '20250127');
        console.log('[index.js] 예매 로직 완료!');
    } catch (err) {
        console.error('[index.js] 예매 과정에서 오류:', err);
    } finally {
        // if (browser) {
        //     await browser.close();
        // }
    }
})();
