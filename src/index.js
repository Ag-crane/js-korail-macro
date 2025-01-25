require('dotenv').config();
const puppeteer = require('puppeteer');
const { loginKorail } = require('./login');
const { startReservation } = require('./reservationPage');
const { runMacro } = require('./macro');

(async () => {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    let page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    // 1) 로그인 로직
    try {
        const loginResult = await loginKorail(browser, page, {
            userId: process.env.USER_ID,
            userPw: process.env.USER_PW
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
        await startReservation(browser, page, '용산', '광주송정', '20250126', '06');
        console.log('[index.js] 예매 로직 완료!');
    } catch (err) {
        console.error('[index.js] 예매 과정에서 오류:', err);
    }

    // 3) 매크로 로직
    try {
        await runMacro(page);
    } catch (err) {
        console.error('[index.js] 매크로 실행 중 오류:', err);
    }
})();
