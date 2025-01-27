const notifier = require('node-notifier');

async function runMacro(page) {

    async function checkReservation() {
        // 예약 버튼 셀렉터
        const selector = 'tbody > tr > td:nth-of-type(6) img[alt="예약하기"]';
        // 예약 버튼 존재 여부 확인
        const reservationButton = await page.$(selector);
        if (reservationButton) {
            console.log('[macro.js] 예약 버튼 발견! 클릭 시도 중...');
            await page.click(selector);
            // 데스크탑 알림 표시
            notifier.notify({
                title: '예약 완료',
                message: '예약이 성공적으로 완료되었습니다!',
                sound: true, // 알림 소리 활성화
            });
            
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
            return true;
        }
        return false;
    };

    async function loopCheck() {
        // 매번 랜덤한 지연 시간 생성
        const randomDelay = () => Math.floor(Math.random() * 1000) + 2500;

        const found = await checkReservation();
        // 예약 버튼 있으면 종료
        if (found) {
            return;
        }
        // 예약 버튼 없으면 새로고침
        await page.reload({ waitUntil: 'networkidle2' });
        // 지연 후 다음 체크
        setTimeout(loopCheck, randomDelay());
    }

    // 첫 체크 시작
    loopCheck();
}

module.exports = { runMacro };
