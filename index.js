document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- Logo scroll rotation ---------------- */
  const logo = document.querySelector('.nav-logo');
  let angle = 0;
  window.addEventListener('scroll', () => {
    angle += window.scrollY * 0.001;
    if (logo) logo.style.transform = `rotate(${angle}rad)`;
  });

  const logos = document.querySelectorAll('.logo-image');
  let current = 0;
  logos[current].classList.add('active');
  setInterval(() => {
    logos[current].classList.remove('active');
    current = (current + 1) % logos.length;
    logos[current].classList.add('active');
  }, 8000);

  /* ---------------- Hamburger menu ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navRight = document.querySelector('.nav-right');
  hamburger?.addEventListener('click', () => {
    navRight?.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link, .btn-login, .btn-signup').forEach(link => {
    link.addEventListener('click', () => {
      navRight?.classList.remove('active');
    });
  });

  /* ---------------- Smooth scroll to category ---------------- */
  window.scrollToCategory = function (id) {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 78;
    const top = target.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  /* ---------------- Tooltip toggle ---------------- */
  const toggleTooltip = (selector) => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        document.querySelectorAll(selector).forEach(item => {
          if (item !== this) item.classList.remove('active');
        });
        this.classList.toggle('active');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll(selector).forEach(item => item.classList.remove('active'));
    });
  };
  toggleTooltip('.toggle-tooltip');
  toggleTooltip('.tooltip-certified');

  /* ---------------- Member video (YouTube) ---------------- */
  let ytLoaded = false;
  let ytPlayers = new Map();
  function loadYouTubeAPI(callback) {
    if (ytLoaded) return callback();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      ytLoaded = true;
      callback();
    };
  }
  document.querySelectorAll('.member-card').forEach((card, index) => {
    const avatar = card.querySelector('.member-avatar');
    const videoContainer = card.querySelector('.member-video-container');
    const iframe = card.querySelector('iframe.member-video');
    const closeBtn = card.querySelector('.video-close-btn');
    if (!avatar || !videoContainer || !iframe) return;

    let player = null;
    avatar.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoContainer.classList.remove('hidden');
      loadYouTubeAPI(() => {
        const playerId = `yt-player-${index}`;
        iframe.id = playerId;
        if (!player) {
          iframe.src = iframe.getAttribute('data-src');
          player = new YT.Player(playerId, {
            events: {
              onReady: () => player.playVideo(),
              onStateChange: (event) => {
                if (event.data === YT.PlayerState.ENDED) {
                  document.fullscreenElement && document.exitFullscreen().catch(() => {});
                  videoContainer.classList.add('hidden');
                  player.stopVideo();
                }
              }
            }
          });
          ytPlayers.set(playerId, player);
        } else {
          player.playVideo();
        }
      });
    });
    closeBtn?.addEventListener('click', () => {
      player?.stopVideo();
      videoContainer.classList.add('hidden');
      document.fullscreenElement && document.exitFullscreen().catch(() => {});
    });
  });

  /* ---------------- Play icon random flashing ---------------- */
  document.querySelectorAll('.play-icon').forEach(icon => {
    const flash = () => {
      const delay = Math.random() * 5000 + 3000;
      setTimeout(() => {
        icon.style.opacity = '1';
        setTimeout(() => {
          icon.style.opacity = '0';
          flash();
        }, 1000);
      }, delay);
    };
    flash();
  });

  /* ---------------- Snowflake animation ---------------- */
  const snowContainer = document.querySelector('.snow-container');
  function createSnowflake() {
    if (!snowContainer || snowContainer.children.length >= 25) return;
    const wrapper = document.createElement('div');
    const snowflake = document.createElement('div');
    snowflake.style.backgroundImage = `url('${Math.random() < 0.5 ? '../../img/sakura.png' : '../../img/sakura_full.png'}')`;
    wrapper.classList.add('snow-wrapper');
    snowflake.classList.add('snowflake');

    const size = Math.random() * 30 + 20;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    wrapper.style.left = `${Math.random() * window.innerWidth}px`;

    const duration = Math.random() * 20 + 40;
    const delay = Math.random();
    wrapper.style.animationDuration = `${duration}s`;
    wrapper.style.animationDelay = `${delay}s`;
    snowflake.style.animationDuration = `${duration * 0.7}s`;

    wrapper.appendChild(snowflake);
    snowContainer.appendChild(wrapper);
    setTimeout(() => snowContainer.removeChild(wrapper), (duration + delay) * 1000);
  }
  for (let i = 0; i < 2; i++) createSnowflake();
  setInterval(createSnowflake, 2500);
  
  /* ---------------- Scroll-track animation ---------------- */
  document.querySelectorAll('.scroll-track').forEach(track => {
    const trackContent = track.innerHTML;
    track.innerHTML += trackContent.repeat(3);
    let x = 0;
    const speed = 0.5;
    const totalWidth = track.scrollWidth / 2;
    (function animate() {
      x -= speed;
      if (Math.abs(x) >= totalWidth) x = 0;
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(animate);
    })();
  });

  /* ---------------- Carousel caption hover ---------------- */
  document.querySelectorAll('.carousel-img').forEach(imgBox => {
    const caption = imgBox.querySelector('.caption');
    imgBox.addEventListener('mouseenter', () => caption.style.opacity = '1');
    imgBox.addEventListener('mouseleave', () => caption.style.opacity = '0');
    imgBox.addEventListener('click', () => {
      caption.style.opacity = '1';
      setTimeout(() => caption.style.opacity = '0', 2000);
    });
  });

  /* ---------------- Attractions 3D overlay ---------------- */
  const attractionsWrapper = document.querySelector('.attractions-3d');
  if (attractionsWrapper) {
    const images = attractionsWrapper.querySelectorAll('img');
    const overlay = document.createElement('div');
    overlay.classList.add('selected-overlay');
    attractionsWrapper.appendChild(overlay);
    let selectedImg = null;
    const moveOverlayTo = (img) => {
      const rect = img.getBoundingClientRect();
      const parentRect = attractionsWrapper.getBoundingClientRect();
      const offsetX = rect.left - parentRect.left + attractionsWrapper.scrollLeft;
      const offsetY = rect.top - parentRect.top + attractionsWrapper.scrollTop;
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
      overlay.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      selectedImg = img;
    };
    images.forEach(img => {
      img.addEventListener('mouseenter', () => moveOverlayTo(img));
      img.addEventListener('click', () => moveOverlayTo(img));
    });
    if (images.length > 0) moveOverlayTo(images[0]);
    window.addEventListener('resize', () => selectedImg && moveOverlayTo(selectedImg));
  }

  /* ---------------- member video (HTML5 video) ---------------- */
  document.querySelectorAll('.member-avatar').forEach(avatar => {
    avatar.addEventListener('click', (e) => {
      e.preventDefault();
      const container = avatar.closest('.member-card');
      const videoContainer = container.querySelector('.member-video-container');
      const video = videoContainer.querySelector('video');
      videoContainer.classList.add('active');
      video.currentTime = 0;
      video.play();
    });
  });
  document.querySelectorAll('.video-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoContainer = btn.closest('.member-video-container');
      const video = videoContainer.querySelector('video');
      video.pause();
      videoContainer.classList.remove('active');
    });
  });

  /* ---------------- Language toggle ---------------- */
  const langWrapper = document.getElementById('lang-wrapper');
  const langToggle = document.getElementById('lang-toggle');
  langToggle?.addEventListener('click', e => {
    e.stopPropagation();
    langWrapper?.classList.toggle('force-show');
  });
  document.addEventListener('click', e => {
    if (!langWrapper?.contains(e.target)) langWrapper?.classList.remove('force-show');
  });

  /* ---------------- YouTube video click & API ---------------- */
  document.getElementById('video-container')?.addEventListener('click', function () {
    const videoId = this.dataset.videoId;
    this.innerHTML = `<iframe id="youtube-iframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"></iframe><button class="video-close-btn" style="font-size: 20px; font-weight: normal;">×</button>`;

    this.querySelector('.video-close-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const thumbnail = this.dataset.thumbnail;
    this.innerHTML = `
      <img src="${thumbnail}">
      <div class="play-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff3399">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    `;
  });

    loadYouTubeAPI(onYouTubeIframeAPIReady);
  });
  let ytSinglePlayer;
  function onYouTubeIframeAPIReady() {
    const iframe = document.getElementById('youtube-iframe');
    if (!iframe) return;
    ytSinglePlayer = new YT.Player(iframe, {
      events: { 'onStateChange': onPlayerStateChange }
    });
  }
  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) exitFullscreen();
  }
  function exitFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
    else if (document.mozFullScreenElement) document.mozCancelFullScreen();
    else if (document.msFullscreenElement) document.msExitFullscreen();
  }

  /* ---------------- Read More toggle ---------------- */
  const readToggle = document.getElementById('toggle-text');
  const aboutText = document.getElementById('about-text');
  readToggle?.addEventListener('click', () => {
    aboutText?.classList.toggle('expanded');
    readToggle.textContent = aboutText?.classList.contains('expanded') ? '閉じる' : 'もっと見る';
  });

  /* ---------------- Lightbox gallery ---------------- */
  const galleryImages = [
  ...Array.from(document.querySelectorAll('.image-grid img, .sub-grid img'))
];
  const videoImg = new Image();
  videoImg.src = '1.jpg';
  galleryImages.unshift(videoImg);
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentIndex = 0;
  const showImage = (index) => {
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightbox.classList.remove('hidden');
  };
  const showPrev = () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => showImage((currentIndex + 1) % galleryImages.length);
  galleryImages.forEach((img, index) => {
  if (index === 0) return;
  img.addEventListener('click', () => showImage(index));
  });
  lightboxClose?.addEventListener('click', () => lightbox.classList.add('hidden'));
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') lightbox.classList.add('hidden');
  });
});

  /* ---------------- Price Format ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.price-format').forEach(el => {
    const text = el.textContent;

    const tokens = text.match(/(\d+(\.\d+)?|[～\-]|[^\d～\-\.\s]+)/g);

    if (!tokens) return;

    const html = tokens.map(token => {
      if (/^\d+(\.\d+)?$/.test(token)) {
        return `<span class="num">${token}</span>`;
      } else if (/[～\-]/.test(token)) {
        return `<span class="symbol">${token}</span>`;
      } else {
        return `<span class="text">${token}</span>`;
      }
    }).join('');

    el.innerHTML = html;
  });
});