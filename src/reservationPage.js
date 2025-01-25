const player = require('play-sound')({});

async function startReservation(browser, page, startStation, endStation, startDate, startTime) {
    try {
        // 출발역 지우기
        await page.waitForSelector('#txtGoStart', { visible: true });
        await page.evaluate(() => {
            const el = document.querySelector('#txtGoStart');
            if (el) el.value = '';
        });
        await page.type('#txtGoStart', startStation);

        // 도착역 지우기
        await page.waitForSelector('#txtGoEnd', { visible: true });
        await page.evaluate(() => {
            const el = document.querySelector('#txtGoEnd');
            if (el) el.value = '';
        });
        await page.type('#txtGoEnd', endStation);

        // 달력 버튼 대기
        await page.waitForSelector('img[alt="달력"].btn_sch_r', { visible: true });

        // 팝업(새 창)이 생성될 때까지 기다리기 위한 Promise 생성
        const newPopupPromise = new Promise(resolve => {
            browser.once('targetcreated', async target => {
                // 새 target(창/탭)이 생기면, 그것을 Page 객체로 변환
                const newPage = await target.page();
                // 팝업 DOM 로딩이 될 때까지 잠시 대기
                await newPage.waitForSelector('body', { timeout: 0 });
                resolve(newPage);
            });
        });

        // 달력 클릭 → 새 팝업 발생
        await page.click('img[alt="달력"].btn_sch_r');

        // popuppage 얻기
        const popupPage = await newPopupPromise;
        console.log('달력 팝업 창 열림');

        // 팝업의 body가 .popup 인지 확인(디버그용)
        const popupBodyClass = await popupPage.evaluate(() => document.body.className);
        console.log('팝업 body 클래스:', popupBodyClass);

        // 팝업 창에서 원하는 날짜 요소가 뜨길 기다린 후 클릭
        await popupPage.waitForSelector(`#d${startDate}`, { visible: true });
        await popupPage.click(`#d${startDate}`);
        console.log(`[reserve.js] ${startDate} 날짜 클릭 완료`);

        // 시간 선택
        await page.waitForSelector('#time', { visible: true });
        await page.select('#time', startTime);

        // "승차권 예매" 이미지 클릭
        console.log('[reserve.js] 승차권 예매(img[alt="승차권예매"]) 버튼 대기');
        await page.waitForSelector('img[alt="승차권예매"]', { visible: true });
        console.log('[reserve.js] 승차권 예매 버튼 클릭');
        await page.click('img[alt="승차권예매"]');

        // 페이지 이동 대기
        console.log('[reserve.js] 페이지 네비게이션 대기 (networkidle2)');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
        console.log('[reserve.js] 승차권 예매 페이지 이동 완료, 현재 URL:', page.url());
    } catch (err) {
        console.error('[reserve.js] 에서 오류:', err);
        throw err;
    }
}

module.exports = { startReservation };
