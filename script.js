const PROJECT_IMAGES = [
  "assets/images/sequence/SIT_01.png",
  "assets/images/sequence/SIT_02.png",
  "assets/images/sequence/SIT_03.png",
  "assets/images/sequence/SIT_04.png",
  "assets/images/sequence/SIT_05.png"
];

const DOM = {
  logo: document.querySelector('.logo'),
  btnAbout: document.getElementById('nav-about'),
  btnContact: document.getElementById('nav-contact'),
  expandedNav: document.getElementById('expanded-nav'),
  mainImage: document.getElementById('main-image'),
  subBtns: document.querySelectorAll('.sub-nav-btn'),
  tabs: document.querySelectorAll('.tab-content')
};

let state = {
  isNavExpanded: false,
  activeTab: 'bio', // 'bio', 'background', 'contact'
  galleryIndex: 0,
  isScrolling: false
};

const TABS_ORDER = ['bio', 'background', 'contact'];

// --- Image Loading ---

function getLowResUrl(hiResUrl) {
  const parts = hiResUrl.split('/');
  const filename = parts.pop();
  return [...parts, `low_${filename}`].join('/');
}

// Aggressively cache low-res sequence directly into RAM for instant scrubbing
const preloadedLowResUrls = [];
const preloadImageWorkers = [];
PROJECT_IMAGES.forEach(hiResUrl => {
  const lowUrl = getLowResUrl(hiResUrl);
  preloadedLowResUrls.push(lowUrl);

  const img = new Image();
  img.src = lowUrl;
  preloadImageWorkers.push(img);
});


function loadHighResImage(index) {
  const imgUrl = PROJECT_IMAGES[index];
  const imgLoader = new Image();
  imgLoader.src = imgUrl;
  imgLoader.onload = () => {
    // Swap seamlessly only if the sequence frame matches the user's resting frame
    if (state.galleryIndex === index) {
      DOM.mainImage.src = imgUrl;
    }
  };
}

// Prefetch first frame
loadHighResImage(state.galleryIndex);

// --- Header Navigation ---

function toggleExpandedNav(targetTab) {
  resetAutoplay(); // Immediately halt and reset the 5s timer if a user interfaces with overlays
  state.isNavExpanded = !state.isNavExpanded;

  if (state.isNavExpanded) {
    DOM.expandedNav.classList.remove('hidden');
    if (targetTab === 'about') {
      DOM.logo.classList.add('faded');
      DOM.btnContact.classList.add('faded');
      DOM.btnAbout.classList.remove('faded');
      changeTab('bio');
    } else if (targetTab === 'contact') {
      DOM.logo.classList.add('faded');
      DOM.btnAbout.classList.add('faded');
      DOM.btnContact.classList.remove('faded');
      changeTab('contact');
    }
  } else {
    // Hide
    DOM.expandedNav.classList.add('hidden');
    // Restore Header to normal
    DOM.logo.classList.remove('faded');
    DOM.btnAbout.classList.remove('faded');
    DOM.btnContact.classList.remove('faded');
  }
}

DOM.btnAbout.addEventListener('click', () => {
  if (state.isNavExpanded && ["bio", "background"].includes(state.activeTab)) {
    // Toggle off if already on about section
    toggleExpandedNav();
  } else if (state.isNavExpanded && state.activeTab === 'contact') {
    // Switch to about
    DOM.btnAbout.classList.remove('faded');
    DOM.btnContact.classList.add('faded');
    changeTab('bio');
  } else {
    // Open
    toggleExpandedNav('about');
  }
});

DOM.btnContact.addEventListener('click', () => {
  if (state.isNavExpanded && state.activeTab === 'contact') {
    // Toggle off if already on contact
    toggleExpandedNav();
  } else if (state.isNavExpanded && ["bio", "background"].includes(state.activeTab)) {
    // Switch tab
    DOM.btnContact.classList.remove('faded');
    DOM.btnAbout.classList.add('faded');
    changeTab('contact');
  } else {
    // Open
    toggleExpandedNav('contact');
  }
});

DOM.logo.addEventListener('click', (e) => {
  e.preventDefault(); // Stop native HTML hard-reload
  
  if (state.isNavExpanded) {
    toggleExpandedNav(); // Softly fade away overlay
  }
  
  // Softly reset gallery back to 0 if we scrolled away
  if (state.galleryIndex !== 0 && !state.isScrolling) {
    state.isScrolling = true;
    DOM.mainImage.style.opacity = 0;
    
    setTimeout(() => {
      state.galleryIndex = 0;
      DOM.mainImage.src = preloadedLowResUrls[0];
      loadHighResImage(0);
      DOM.mainImage.style.opacity = 1;
    }, 400);
    
    setTimeout(() => {
      state.isScrolling = false;
    }, 800);
  }
});

// --- Tab Interactions ---

DOM.subBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.target.getAttribute('data-target');
    changeTab(target);
    updateHeaderBasedOnTab(target);
  });
});

function updateHeaderBasedOnTab(tabName) {
  if (tabName === 'contact') {
    DOM.btnContact.classList.remove('faded');
    DOM.btnAbout.classList.add('faded');
    DOM.logo.classList.add('faded');
  } else {
    DOM.btnAbout.classList.remove('faded');
    DOM.btnContact.classList.add('faded');
    DOM.logo.classList.add('faded');
  }
}

function changeTab(tabName) {
  state.activeTab = tabName;
  // Update Buttons
  DOM.subBtns.forEach(btn => {
    if (btn.getAttribute('data-target') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Content Panels
  DOM.tabs.forEach(tab => {
    if (tab.id === `content-${tabName}`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

// --- Dynamic Scrollytelling Engine ---

function handleTabHop(direction) {
  if (state.isScrolling) return; // Prevent glitches by locking input during animations
  state.isScrolling = true;
  
  const step = Math.sign(direction);
  const currentIndex = TABS_ORDER.indexOf(state.activeTab);
  let nextIndex = currentIndex + step;
  
  if (nextIndex >= TABS_ORDER.length) nextIndex = TABS_ORDER.length - 1;
  if (nextIndex < 0) nextIndex = 0;
  
  if (nextIndex !== currentIndex) {
    const nextTab = TABS_ORDER[nextIndex];
    changeTab(nextTab);
    updateHeaderBasedOnTab(nextTab);
  }
  
  setTimeout(() => {
    state.isScrolling = false;
  }, 600); // Shorter cyclic unlock for tab hops
}

function handleScroll(direction) {
  if (state.isScrolling) return;
  state.isScrolling = true;

  // Soft Disappear & Appear Engine
  DOM.mainImage.style.opacity = 0; // Trigger CSS fade out towards pure white
  
  setTimeout(() => {
    let nextIndex = state.galleryIndex + direction;
    // Perfect cyclic loop math
    nextIndex = nextIndex % PROJECT_IMAGES.length;
    if (nextIndex < 0) nextIndex += PROJECT_IMAGES.length;
    
    state.galleryIndex = nextIndex;
    
    // Inject hardware-cached low res source while invisible
    DOM.mainImage.src = preloadedLowResUrls[state.galleryIndex];
    // Kickstart asynchronous high-res fetch
    loadHighResImage(state.galleryIndex);
    
    DOM.mainImage.style.opacity = 1; // Trigger CSS fade in
  }, 400); // 400ms matches the CSS transition window
  
  setTimeout(() => {
    state.isScrolling = false;
  }, 800); // Complete visual loop un-locks
}

let scrollAccumulator = 0;
const SCROLL_SENSITIVITY = 400; // Pixel threshold to snap to sequence frames natively
const TOUCH_SENSITIVITY = 60; // Hyper-responsive threshold for tiny physical mobile swiping distances

// Wheel Event Interception
window.addEventListener('wheel', (e) => {
  resetAutoplay(); // Pause auto-scrolling the exact moment a trackpad engagement is detected
  e.preventDefault(); // Universally trap native scrolling mechanism
  scrollAccumulator += e.deltaY;
  
  if (Math.abs(scrollAccumulator) >= SCROLL_SENSITIVITY) {
    const framesToMove = Math.sign(scrollAccumulator) * Math.floor(Math.abs(scrollAccumulator) / SCROLL_SENSITIVITY);
    scrollAccumulator = scrollAccumulator % SCROLL_SENSITIVITY;
    
    if (state.isNavExpanded) {
      handleTabHop(framesToMove);
    } else {
      handleScroll(framesToMove);
    }
  }
}, { passive: false });

// Touch Event Interception
let touchStartY = 0;
let touchAccumulator = 0;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  // Important: We NO LONGER reset touchAccumulator to 0 here to allow multiple short finger swipes to pool up to 150px
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  resetAutoplay(); // Halt sequence auto-play upon physical finger engagement 
  e.preventDefault(); // Universally trap native mobile swiping for sequence framework
  
  const touchEndY = e.touches[0].clientY;
  const diff = touchStartY - touchEndY;
  touchStartY = touchEndY;

  touchAccumulator += diff;
  if (Math.abs(touchAccumulator) >= TOUCH_SENSITIVITY) {
    const framesToMove = Math.sign(touchAccumulator) * Math.floor(Math.abs(touchAccumulator) / TOUCH_SENSITIVITY);
    touchAccumulator = touchAccumulator % TOUCH_SENSITIVITY;
    
    if (state.isNavExpanded) {
      handleTabHop(framesToMove);
    } else {
      handleScroll(framesToMove);
    }
  }
}, { passive: false });

// --- Auto-play Engine ---
let autoplayTimer = null;
const AUTOPLAY_INTERVAL = 5000;

function startAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    // Only automatically advance if the gallery is physically visible and idle
    if (!state.isNavExpanded && !state.isScrolling) {
      handleScroll(1); // Scrub one discrete frame forward
    }
  }, AUTOPLAY_INTERVAL);
}

function resetAutoplay() {
  startAutoplay();
}

// Kickstart engine on bootstrap
startAutoplay();
