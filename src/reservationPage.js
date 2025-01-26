async function startReservation(browser, page, startStation, endStation, startDate, startTime) {
    // 출발역
    await page.waitForSelector('#txtGoStart', { visible: true });
    await page.evaluate(() => {
        const el = document.querySelector('#txtGoStart');
        if (el) el.value = '';
    });
    await page.type('#txtGoStart', startStation);

    // 도착역
    await page.waitForSelector('#txtGoEnd', { visible: true });
    await page.evaluate(() => {
        const el = document.querySelector('#txtGoEnd');
        if (el) el.value = '';
    });
    await page.type('#txtGoEnd', endStation);

    // 달력
    await page.waitForSelector('img[alt="달력"].btn_sch_r', { visible: true });
    // 팝업(새 창)이 생성될 때까지 기다리기 위한 Promise
    const newPopupPromise = new Promise(resolve => {
        browser.once('targetcreated', async target => {
            const newPage = await target.page(); // 새 target(창/탭)이 생기면, 그것을 Page 객체로 변환
            await newPage.waitForSelector('body', { timeout: 0 }); // 팝업 DOM 로딩이 될 때까지 잠시 대기
            resolve(newPage);
        });
    });
    await page.click('img[alt="달력"].btn_sch_r'); // 달력 클릭 → 새 팝업 발생
    const popupPage = await newPopupPromise;
    await popupPage.waitForSelector(`#d${startDate}`, { visible: true });
    await popupPage.click(`#d${startDate}`);

    // 시간 선택
    await page.waitForSelector('#time', { visible: true });
    await page.select('#time', startTime);

    // "승차권 예매" 이미지 클릭
    await page.waitForSelector('img[alt="승차권예매"]', { visible: true });
    await page.click('img[alt="승차권예매"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
}

module.exports = { startReservation };
