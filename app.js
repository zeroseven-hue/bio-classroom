// bio-classroom Main Lobby JavaScript (大廳四) - V2.1 Security & Dispatch Protection
document.addEventListener('DOMContentLoaded', () => {
  const LOCAL_STORAGE_COLLAPSE_KEY = 'bio_classroom_collapsed_categories';
  const LOCAL_STORAGE_PIN_KEY = 'bio_classroom_teacher_pin';
  const LOCAL_STORAGE_LOCK_ENABLED = 'bio_classroom_pin_enabled';

  // DOM Elements for QR Dispatch
  const selectTool = document.getElementById('selectTool');
  const btnGenerateQR = document.getElementById('btnGenerateQR');
  const btnCopyUrl = document.getElementById('btnCopyUrl');
  const qrResultArea = document.getElementById('qrResultArea');
  const qrcodeContainer = document.getElementById('qrcode');
  const generatedUrlInput = document.getElementById('generatedUrlInput');
  const btnDirectLaunch = document.getElementById('btnDirectLaunch');

  // DOM Elements for Collapsible Categories
  const categorySections = document.querySelectorAll('.category-section');
  const btnExpandAll = document.getElementById('btnExpandAll');
  const btnCollapseAll = document.getElementById('btnCollapseAll');

  // Security Lock Elements
  const btnSecurityPin = document.getElementById('btnSecurityPin');
  const pinLockModal = document.getElementById('pinLockModal');
  const pinInput = document.getElementById('pinInput');
  const btnSubmitPin = document.getElementById('btnSubmitPin');
  const pinErrorMsg = document.getElementById('pinErrorMsg');

  let qrInstance = null;

  // --- 🔒 Teacher Security PIN Lock Logic ---
  function checkSecurityLock() {
    const isLockEnabled = localStorage.getItem(LOCAL_STORAGE_LOCK_ENABLED) === 'true';
    const savedPin = localStorage.getItem(LOCAL_STORAGE_PIN_KEY);

    if (isLockEnabled && savedPin && pinLockModal) {
      pinLockModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  if (btnSubmitPin) {
    btnSubmitPin.addEventListener('click', () => {
      const enteredPin = pinInput.value.trim();
      const savedPin = localStorage.getItem(LOCAL_STORAGE_PIN_KEY);

      if (enteredPin === savedPin) {
        pinLockModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        pinInput.value = '';
        pinErrorMsg.textContent = '';
      } else {
        pinErrorMsg.textContent = '❌ 解鎖密碼不正確，請重新輸入！';
        pinInput.value = '';
        pinInput.focus();
      }
    });

    pinInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnSubmitPin.click();
    });
  }

  if (btnSecurityPin) {
    btnSecurityPin.addEventListener('click', () => {
      const savedPin = localStorage.getItem(LOCAL_STORAGE_PIN_KEY) || '1234';
      const isCurrentlyEnabled = localStorage.getItem(LOCAL_STORAGE_LOCK_ENABLED) === 'true';

      const promptMsg = isCurrentlyEnabled 
        ? `目前【導師安全鎖】已開啟 (預設密碼: ${savedPin})\n輸入新 4 位數密碼可更新；輸入「off」可關閉密碼鎖：`
        : `請設定 4 位數導師防窺密碼 (例如：1234)：`;

      const input = prompt(promptMsg, savedPin);
      if (input === null) return;

      if (input.toLowerCase() === 'off') {
        localStorage.setItem(LOCAL_STORAGE_LOCK_ENABLED, 'false');
        btnSecurityPin.textContent = '🔓 導師防窺鎖 (已關閉)';
        btnSecurityPin.className = 'btn-security-lock off';
        alert('已關閉導師安全密碼鎖！');
      } else if (input.trim().length >= 4) {
        localStorage.setItem(LOCAL_STORAGE_PIN_KEY, input.trim());
        localStorage.setItem(LOCAL_STORAGE_LOCK_ENABLED, 'true');
        btnSecurityPin.textContent = `🔒 導師防窺鎖 (已開啟 - 密碼: ${input.trim()})`;
        btnSecurityPin.className = 'btn-security-lock on';
        alert(`✅ 已開啟導師安全鎖！密碼設為：${input.trim()}`);
      } else {
        alert('密碼長度建議至少 4 位數字。');
      }
    });

    // Update Lock Button State on Load
    const isCurrentlyEnabled = localStorage.getItem(LOCAL_STORAGE_LOCK_ENABLED) === 'true';
    const savedPin = localStorage.getItem(LOCAL_STORAGE_PIN_KEY) || '1234';
    if (isCurrentlyEnabled) {
      btnSecurityPin.textContent = `🔒 導師防窺鎖 (已開啟)`;
      btnSecurityPin.className = 'btn-security-lock on';
    } else {
      btnSecurityPin.textContent = '🔓 設定導師防窺密碼鎖';
      btnSecurityPin.className = 'btn-security-lock off';
    }
  }

  // --- Collapsible Category Logic ---
  function loadCollapseState() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_COLLAPSE_KEY);
      if (raw) {
        const collapsedState = JSON.parse(raw);
        categorySections.forEach(sec => {
          const catKey = sec.dataset.cat;
          if (collapsedState[catKey] === true) {
            sec.classList.add('collapsed');
            updateHeaderToggleUI(sec);
          }
        });
      }
    } catch (e) {
      console.error('Failed to load collapse state', e);
    }
  }

  function saveCollapseState() {
    const collapsedState = {};
    categorySections.forEach(sec => {
      const catKey = sec.dataset.cat;
      collapsedState[catKey] = sec.classList.contains('collapsed');
    });
    localStorage.setItem(LOCAL_STORAGE_COLLAPSE_KEY, JSON.stringify(collapsedState));
  }

  function updateHeaderToggleUI(sec) {
    const textSpan = sec.querySelector('.toggle-text');
    const isCollapsed = sec.classList.contains('collapsed');
    if (textSpan) {
      textSpan.textContent = isCollapsed ? '▼ 點擊展開' : '▲ 折疊收合';
    }
  }

  function toggleSection(sec) {
    sec.classList.toggle('collapsed');
    updateHeaderToggleUI(sec);
    saveCollapseState();
  }

  categorySections.forEach(sec => {
    const header = sec.querySelector('.category-header');
    if (header) {
      header.addEventListener('click', () => toggleSection(sec));
    }
  });

  if (btnExpandAll) {
    btnExpandAll.addEventListener('click', () => {
      categorySections.forEach(sec => {
        sec.classList.remove('collapsed');
        updateHeaderToggleUI(sec);
      });
      saveCollapseState();
    });
  }

  if (btnCollapseAll) {
    btnCollapseAll.addEventListener('click', () => {
      categorySections.forEach(sec => {
        sec.classList.add('collapsed');
        updateHeaderToggleUI(sec);
      });
      saveCollapseState();
    });
  }

  // --- 📱 Smart Dispatcher (Auto Appends ?dispatch=true to hide return buttons) ---
  function getTargetUrl() {
    const relativePath = selectTool.value;
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    // Auto append ?dispatch=true for security
    const separator = relativePath.includes('?') ? '&' : '?';
    return baseUrl + relativePath + separator + 'dispatch=true';
  }

  btnGenerateQR.addEventListener('click', () => {
    const fullUrl = getTargetUrl();
    qrResultArea.classList.remove('hidden');
    generatedUrlInput.value = fullUrl;
    btnDirectLaunch.href = fullUrl;

    qrcodeContainer.innerHTML = '';
    qrInstance = new QRCode(qrcodeContainer, {
      text: fullUrl,
      width: 180,
      height: 180,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  });

  btnCopyUrl.addEventListener('click', () => {
    const fullUrl = getTargetUrl();
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('✅ 學生派發網址已複製！（已自動包含隱藏大廳返回鈕安全參數）');
    }).catch(() => {
      alert('複製失敗，請手動選取複製：\n' + fullUrl);
    });
  });

  // Initialize Security Lock & Collapse states
  checkSecurityLock();
  loadCollapseState();
});
