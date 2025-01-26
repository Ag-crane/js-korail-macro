async function loginKorail(browser, page, { userId, userPw }) {
    // 코레일 로그인 페이지 접속
    await page.goto('https://www.letskorail.com/korail/com/login.do', {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    await new Promise((page) => setTimeout(page, 3000)); // waitForTimeout 대체

    // Alert 핸들링
    let alertMessage = null;
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // ID/PW 입력
    await page.waitForSelector('#txtMember', { visible: true, timeout: 0 }); // 가끔 ID 입력이 건너 뛰어지는 경우가 있음
    await page.type('#txtMember', userId);
    await page.waitForSelector('#txtPwd', {  visible: true, timeout: 0 });
    await page.type('#txtPwd', userPw);

    // 로그인 버튼 클릭
    await page.click('img[alt="확인"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });

    // Alert 메세지 있으면 에러 throw
    if (alertMessage) {
      throw new Error(`로그인 실패(알림창): ${alertMessage}`);
    }

    // 로그아웃 버튼 체크
    const logoutBtn = await page.$('a[onclick="return m_logout_link()"]');
    if (!logoutBtn) {
      throw new Error('로그인 실패(로그아웃 버튼 미발견)');
    }

    return { browser, page };
}

module.exports = { loginKorail };
