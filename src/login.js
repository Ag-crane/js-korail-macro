async function loginKorail(browser, page, { userId, userPw }) {
  try {
    // 코레일 로그인 페이지 접속
    console.log('[login.js] 로그인 페이지로 이동: https://www.letskorail.com/korail/com/login.do');
    await page.goto('https://www.letskorail.com/korail/com/login.do', {
      waitUntil: 'networkidle2',
      timeout: 0,
    });
    console.log('[login.js] 로그인 페이지 접속 완료, 현재 URL:', page.url());

    // Alert 핸들링
    let alertMessage = null;
    page.on('dialog', async (dialog) => {
      console.log(`[login.js] alert/confirm/prompt 발생: ${dialog.message()}`);
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // ID/PW 입력
    console.log('[login.js] #txtMember 셀렉터 대기 시작');
    await page.waitForSelector('#txtMember', { visible: true, timeout: 0 });
    console.log('[login.js] #txtMember 발견, 아이디 입력 시도:', userId);
    await page.type('#txtMember', userId);

    console.log('[login.js] #txtPwd 셀렉터 대기 시작');
    await page.waitForSelector('#txtPwd', {  visible: true, timeout: 0 });
    console.log('[login.js] #txtPwd 발견, 비밀번호 입력 시도');
    await page.type('#txtPwd', userPw);

    // 로그인 버튼 클릭
    console.log('[login.js] 로그인 버튼(확인) 클릭 시도');
    await page.click('img[alt="확인"]');
    console.log('[login.js] 로그인 버튼 클릭 완료');

    // 페이지 전환 대기
    console.log('[login.js] waitForNavigation 대기 시작 (networkidle2)');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
    console.log('[login.js] 페이지 이동 완료, 현재 URL:', page.url());

    // alert 메시지로 인해 실패했는지 판단
    if (alertMessage) {
      const errMsg = `[loginKorail] 로그인 실패(알림창): ${alertMessage}`;
      console.error(`[login.js] ${errMsg}`);
      throw new Error(errMsg);
    }

    // 로그아웃 버튼 체크
    console.log('[login.js] 로그아웃 버튼 존재 여부 확인');
    const logoutBtn = await page.$('a[onclick="return m_logout_link()"]');
    if (!logoutBtn) {
      const errMsg = '[loginKorail] 로그인 실패 또는 추가 인증 필요 (로그아웃 버튼 미발견)';
      console.error(`[login.js] ${errMsg}`);
      throw new Error(errMsg);
    }

    console.log('[login.js] 로그인 성공 - logout 버튼 발견');
    return { browser, page };
  } catch (err) {
    console.error('[login.js] 로그인 로직에서 오류 발생:', err);
    if (browser) {
      await browser.close();
    }
    throw err;
  }
}

module.exports = { loginKorail };
