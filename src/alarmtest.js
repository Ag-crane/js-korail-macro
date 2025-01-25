// Notification API를 활용한 예약 완료 알림 함수
async function notifyUser() {

    // 사용자가 이미 알림을 허용한 경우
    if (Notification.permission === 'granted') {
        new Notification('예약 완료', {
            body: '예약이 성공적으로 완료되었습니다!',
        });
    } 
    // 알림 권한이 차단되지 않은 경우 권한 요청
    else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission(); // 권한 요청
        if (permission === 'granted') {
            new Notification('예약 완료', {
                body: '예약이 성공적으로 완료되었습니다!',
            });
        }
    }
}

// 예약 완료 시 알림 호출을 테스트하는 함수
async function runTest() {
    console.log('[test] 예약 프로세스 시작...');
    setTimeout(async () => {
        console.log('[test] 예약 버튼 클릭 완료!');
        await notifyUser(); // 알림 호출
    }, 2000); // 2초 후 예약 완료 이벤트 시뮬레이션
}

// 비동기 실행
(async function () {
    await runTest();
})();
