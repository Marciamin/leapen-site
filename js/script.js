// Page Navigation
function showPage(pageId, pushHistory = true) {
  // 오디오 정지
  if (typeof stopAudio === 'function') {
    stopAudio();
  }
  
  // Daily One Sentence 페이지로 들어갈 때 오늘 날짜로 리셋
  if (pageId === 'daily-one-sentence') {
    currentCalendarDate = new Date();
    if (typeof renderCalendar === 'function') renderCalendar();
    
    // 오늘 날짜를 기본으로 선택
    setTimeout(() => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      if (typeof selectDate === 'function') {
        selectDate(todayStr);
      }
    }, 100);
  }
  
  // 보이스룸 100일 챌린지 페이지 열 때 전체 필터로 초기화
  if (pageId === 'voice-room-category-01') {
    setTimeout(() => {
      const allBtn = document.querySelector('#voice-room-category-01 .filter-btn[onclick*="all"]');
      if (allBtn) {
        const filterBtns = document.querySelectorAll('#voice-room-category-01 .filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        allBtn.classList.add('active');
        
        const cards = document.querySelectorAll('#voice-room-category-01 .voice-room-question-card');
        cards.forEach(card => {
          card.style.display = 'block';
        });
      }
    }, 100);
  }
  
  // Small Talk 보이스룸 페이지 열 때 오늘 날짜로 초기화
  if (pageId === 'voice-room-category-02') {
    if (typeof renderSmallTalkCalendar === 'function') {
      currentSmallTalkCalendarDate = new Date();
      renderSmallTalkCalendar();
      // 오늘 날짜를 기본으로 선택
      setTimeout(() => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        if (typeof selectSmallTalkDate === 'function') {
          selectSmallTalkDate(todayStr);
        }
      }, 100);
    }
  }
  
  // 브라우저 히스토리에 추가
  if (pushHistory) {
    history.pushState({ page: pageId }, '', '#' + pageId);
  }
  
  // Hide all pages
  const pages = document.querySelectorAll('.page-section');
  pages.forEach(page => {
    page.classList.remove('active');
  });

  // Show selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }

  // Update active menu item
  const menuItems = document.querySelectorAll('.nav-menu > li');
  menuItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Find and activate the corresponding menu item
  menuItems.forEach(item => {
    const itemText = item.textContent.trim().split('\n')[0];
    if (itemText === 'Home' && pageId === 'home') {
      item.classList.add('active');
    } else if (itemText === 'About' && pageId === 'about') {
      item.classList.add('active');
    } else if (itemText === 'Resources' && pageId === 'resources') {
      item.classList.add('active');
    } else if (itemText === 'Contact' && pageId === 'contact') {
      item.classList.add('active');
    } else if ((itemText === 'Login' || itemText === 'Logout') && pageId === 'login') {
      item.classList.add('active');
    }
    // Check dropdown items
    const dropdownItems = item.querySelectorAll('.dropdown li');
    dropdownItems.forEach(dropdownItem => {
      const dropdownText = dropdownItem.textContent.trim();
      if ((dropdownText === '나를 발견하는 시간' && pageId === 'discover') ||
          (dropdownText === '비즈니스 영어' && pageId === 'business') ||
          (dropdownText === 'Resume' && pageId === 'resume') ||
          (dropdownText === 'Cover Letter' && pageId === 'coverletter') ||
          (dropdownText === 'Interview' && pageId === 'interview')) {
        item.classList.add('active');
      }
    });
  });

  // Close mobile menu
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.remove('active');
  
  // 페이지 전환 시 항상 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // 모바일 호환성을 위해 즉시 스크롤도 추가
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('active');
}

// Initialize는 아래의 인증 상태 확인과 통합됨

// 뒤로가기/앞으로가기 지원
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.page) {
    showPage(event.state.page, false);
  } else {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      showPage(hash, false);
    } else {
      showPage('home', false);
    }
  }
});

// Flip Card Function
function flipCard(card) {
  card.classList.toggle('flipped');
}

// Authentication System
let isAdmin = false;

// 로그인 상태 확인
function checkAuthStatus() {
  const authStatus = localStorage.getItem('leapen_auth');
  if (authStatus === 'admin') {
    isAdmin = true;
    updateMenuForAuth();
    return true;
  }
  isAdmin = false;
  updateMenuForGuest();
  return false;
}

// 로그인 처리
function handleLogin(event) {
  event.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  
  if (id === 'Admin' && password === 'admin0415') {
    localStorage.setItem('leapen_auth', 'admin');
    isAdmin = true;
    errorDiv.style.display = 'none';
    updateMenuForAuth();
    showPage('home');
    alert('로그인 성공! 모든 메뉴에 접근할 수 있습니다.');
  } else {
    errorDiv.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
    errorDiv.style.display = 'block';
  }
}

// 로그아웃
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('leapen_auth');
    isAdmin = false;
    updateMenuForGuest();
    showPage('home');
    alert('로그아웃되었습니다. 게스트 모드로 전환됩니다.');
  }
}

// Admin용 메뉴 표시
function updateMenuForAuth() {
  // 모든 메뉴 항목 표시
  const allMenuItems = document.querySelectorAll('.nav-menu > li');
  allMenuItems.forEach(item => {
    item.style.display = '';
  });
  
  // 드롭다운 내 모든 항목 표시
  const allDropdownItems = document.querySelectorAll('.dropdown li');
  allDropdownItems.forEach(item => {
    item.style.display = '';
  });
  
  // Login/Logout 버튼 전환
  const loginBtn = document.getElementById('loginMenuBtn');
  const logoutBtn = document.getElementById('logoutMenuBtn');
  if (loginBtn) loginBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = '';
}

// 게스트용 메뉴 제한
function updateMenuForGuest() {
  // Daily Practice - Today's One Sentence만 표시
  const dailyPracticeItems = document.querySelectorAll('.nav-menu > li.has-dropdown');
  dailyPracticeItems.forEach(dropdown => {
    const text = dropdown.textContent.trim();
    if (text.includes('Daily Practice')) {
      const items = dropdown.querySelectorAll('.dropdown li');
      items.forEach(item => {
        const itemText = item.textContent.trim();
        if (itemText === 'Today\'s One Sentence') {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }
    // English Study - LEAPEN 보이스룸, 52주 필사만 표시
    else if (text.includes('English Study')) {
      const items = dropdown.querySelectorAll('.dropdown li');
      items.forEach(item => {
        const itemText = item.textContent.trim();
        if (itemText === 'LEAPEN 보이스룸' || itemText === '52주 필사') {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }
    // Career Mentor - Active Verbs만 표시
    else if (text.includes('Career Mentor')) {
      const items = dropdown.querySelectorAll('.dropdown li');
      items.forEach(item => {
        const itemText = item.textContent.trim();
        if (itemText === 'Active Verbs') {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }
  });
  
  // Login/Logout 버튼 전환
  const loginBtn = document.getElementById('loginMenuBtn');
  const logoutBtn = document.getElementById('logoutMenuBtn');
  if (loginBtn) loginBtn.style.display = '';
  if (logoutBtn) logoutBtn.style.display = 'none';
}

// 페이지 접근 제어
function checkPageAccess(pageId) {
  // Admin은 모든 페이지 접근 가능
  if (isAdmin) {
    return true;
  }
  
  // 게스트 모드에서 접근 가능한 페이지
  const guestAllowedPages = [
    'home',
    'daily-one-sentence',
    'leapen-openchat',
    'voice-room-category-01',
    'voice-room-category-02',
    '52weeks',
    'Activeverbs',
    'resources',
    'about',
    'contact',
    'login'
  ];
  
  if (guestAllowedPages.includes(pageId)) {
    return true;
  }
  
  // 접근 불가 페이지
  alert('이 페이지는 로그인이 필요합니다.');
  showPage('login');
  return false;
}

// showPage 함수 수정 - 접근 제어 추가
// DOMContentLoaded 이벤트가 발생하기 전에 래핑해야 함
(function() {
  const originalShowPage = window.showPage;
  window.showPage = function(pageId, pushHistory = true) {
    // 접근 제어 확인
    if (!checkPageAccess(pageId)) {
      return;
    }
    
    // 원래 showPage 함수 호출
    if (originalShowPage) {
      originalShowPage(pageId, pushHistory);
    }
  };
})();

// 페이지 로드 시 인증 상태 확인 및 메뉴 업데이트
window.addEventListener('DOMContentLoaded', function() {
  checkAuthStatus();
  
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    if (checkPageAccess(hash)) {
      showPage(hash, false);
    } else {
      showPage('home', false);
    }
  } else {
    showPage('home', false);
  }
});