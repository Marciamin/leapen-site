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
    } else if (itemText === 'Join' && pageId === 'join') {
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
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('active');
}

// Initialize - show page based on URL hash or home
window.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash.slice(1); // # 제거
  if (hash && document.getElementById(hash)) {
    showPage(hash, false);
  } else {
    showPage('home', false);
  }
});

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