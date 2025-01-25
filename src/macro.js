const notifier = require('node-notifier');

async function runMacro(page) {
    const randomDelay = () => Math.floor(Math.random() * 1000) + 2500;

    try {
        // 주기적으로 예약 버튼 확인 및 클릭
        const checkReservation = async () => {
            console.log('[macro.js] 예약 버튼 확인 중...');
            try {
                // 예약 버튼 셀렉터
                const selector = 'tbody > tr > td:nth-of-type(6) img[alt="예약하기"]';

                // 예약 버튼 존재 여부 확인
                const reservationButton = await page.$(selector);
                if (reservationButton) {
                    console.log('[macro.js] 예약 버튼 발견! 클릭 시도 중...');
                    await page.click(selector);
                    console.log('[macro.js] 예약 버튼 클릭 완료!');

                    // 데스크탑 알림 표시
                    notifier.notify({
                        title: '예약 완료',
                        message: '예약이 성공적으로 완료되었습니다!',
                        sound: true, // 알림 소리 활성화
                    });

                    clearInterval(intervalId); // 반복 중단
                    return;
                }
            } catch (err) {
                console.error('[macro.js] 예약 버튼 확인 중 오류 발생:', err);
            }
        };

        // 새로고침 및 예약 버튼 확인 루프
        const intervalId = setInterval(async () => {
            await checkReservation();
            console.log('[macro.js] 페이지 새로고침 중...');
            await page.reload({ waitUntil: 'networkidle2' });
        }, randomDelay());
    } catch (err) {
        console.error('[macro.js] 매크로 실행 중 오류 발생:', err);
    }
}

module.exports = { runMacro };
