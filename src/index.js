require('dotenv').config();
const puppeteer = require('puppeteer');
const { loginKorail } = require('./login');
const { startReservation } = require('./reservationPage');
const { runMacro } = require('./macro');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });
        let page = await browser.newPage();

        // 사람이 사용하는 브라우저로 위장장
        await page.setUserAgent('Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        });

        // 1) 로그인
        console.log('[index.js] 로그인 시도 중...');
        const loginResult = await loginKorail(browser, page, {
            userId: process.env.USER_ID,
            userPw: process.env.USER_PW
        });
        browser = loginResult.browser;
        page = loginResult.page;
        console.log('[index.js] 로그인 완료!');

        // 2) 예매 페이지로 이동
        console.log('[index.js] 예매 페이지로 이동 시작...');
        await startReservation(browser, page, '용산', '광주송정', '20250127', '08');
        console.log('[index.js] 예매 페이지로 이동 완료!');

        // 3) 매크로
        console.log('[index.js] 매크로 로직 시작...');
        await runMacro(page);
        console.log('[index.js] 매크로 로직 종료!');
    } catch (err) {
        console.error('[index.js] 에러 발생:', err);
    }
})();
