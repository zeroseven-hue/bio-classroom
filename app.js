
// --- 🌓 大廳四 主題切換邏輯 ---
function initHall4Theme() {
  const saved = localStorage.getItem('bio_hall4_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleHall4Theme() {
  const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', cur);
  localStorage.setItem('bio_hall4_theme', cur);
}
initHall4Theme();

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

  // --- 🔒 Unified Teacher Security PIN Lock Logic (Unified 8088) ---
  const DEFAULT_PIN = '8088';
  
  if (btnSecurityPin) {
    btnSecurityPin.addEventListener('click', () => {
      const curPin = localStorage.getItem('teacher_global_pin') || DEFAULT_PIN;
      const input = prompt('🔒 請輸入新設定的 4 位數教師管理密碼：');
      if (input === null) return;
      if (input.trim().length >= 4) {
        localStorage.setItem('teacher_global_pin', input.trim());
        localStorage.setItem('bio_classroom_teacher_pin', input.trim());
        alert('✅ 已成功更新教師管理密碼！');
      } else {
        alert('密碼長度建議至少 4 位數字。');
      }
    });
    btnSecurityPin.textContent = '🔒 教師管理鎖';
    btnSecurityPin.className = 'btn-security-lock on';
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
  loadCollapseState();
});



// ==================== 🔒 全域教師安全驗證門禁系統 (統一 8088，無洩漏) ====================
(function initGlobalHallGatekeeper() {
  const SESSION_AUTH_KEY = 'bio_teacher_auth_passed';
  const PIN_KEY = 'teacher_global_pin';
  const DEFAULT_PIN = '8088';

  // 自動清理過去可能殘留的舊預設值 '1234'
  try {
    if (localStorage.getItem('bio_classroom_teacher_pin') === '1234') {
      localStorage.removeItem('bio_classroom_teacher_pin');
    }
    if (localStorage.getItem(PIN_KEY) === '1234') {
      localStorage.removeItem(PIN_KEY);
    }
  } catch(e) {}

  function isAuthed() {
    return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  }

  function setAuthed() {
    sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
  }

  function setup() {
    const modal = document.getElementById('pinLockModal');
    const pinInput = document.getElementById('pinInput');
    const btnSubmit = document.getElementById('btnSubmitPin');
    const errMsg = document.getElementById('pinErrorMsg');

    if (!modal) return;

    if (isAuthed()) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      return;
    }

    // 未驗證：強制鎖定畫面
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (pinInput) setTimeout(() => pinInput.focus(), 200);

    function verifyPin() {
      const entered = (pinInput ? pinInput.value.trim() : '');
      const validPin = localStorage.getItem(PIN_KEY) || localStorage.getItem('bio_classroom_teacher_pin') || DEFAULT_PIN;
      if (entered === validPin || entered === DEFAULT_PIN) {
        setAuthed();
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if (pinInput) pinInput.value = '';
        if (errMsg) errMsg.textContent = '';
      } else {
        if (errMsg) errMsg.textContent = '❌ 密碼不正確，請重新輸入！';
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    }

    if (btnSubmit) {
      btnSubmit.onclick = verifyPin;
    }
    if (pinInput) {
      pinInput.onkeydown = (e) => {
        if (e.key === 'Enter') verifyPin();
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
