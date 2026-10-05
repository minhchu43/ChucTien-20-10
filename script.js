// SCRIPT.JS - INTERACTIVE FEATURES FOR THỦY TIÊN 20/10 LANDING PAGE

document.addEventListener('DOMContentLoaded', () => {
  // 1. GENTLE BACKGROUND AMBIENT PARTICLES (NO CLICK EFFECT)
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const emojis = ['🌸', '✨', '💖', '🎀', '🍓', '💕', '🌷'];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 12 + 10;
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = Math.random() * 1.5 + 0.8;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
      this.opacity = 1;
      this.fade = 0.0025;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      this.opacity -= this.fade;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.font = `${this.size}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`;
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  // Soft continuous gentle petal fall in background
  setInterval(() => {
    if (particles.length < 25) {
      particles.push(new Particle());
    }
  }, 450);

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > height + 50) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 2. TYPEWRITER EFFECT FOR HERO HEADLINE
  const typewriterEl = document.getElementById('typewriter-content');
  const headlineText = "Có một loài hoa không cần đến mùa mới nở.";
  let charIdx = 0;
  function typeWriter() {
    if (typewriterEl && charIdx < headlineText.length) {
      typewriterEl.textContent += headlineText.charAt(charIdx);
      charIdx++;
      setTimeout(typeWriter, 50);
    } else if (typewriterEl) {
      setTimeout(() => {
        typewriterEl.classList.add('done');
      }, 3000);
    }
  }
  setTimeout(typeWriter, 350);

  // 3. AUDIO PLAYER: 'ĐỦ NẮNG HOA SẼ NỞ' (PHÙNG KHÁNH LINH)
  const bgmAudio = document.getElementById('bgm-audio');
  const vinylDisc = document.querySelector('.vinyl-disc');
  const musicStatus = document.querySelector('.music-status');
  const musicWidget = document.getElementById('music-widget');
  let isPlayingMusic = false;

  function playSong() {
    if (!bgmAudio) return;
    bgmAudio.play().then(() => {
      isPlayingMusic = true;
      vinylDisc.classList.add('playing');
      musicStatus.textContent = 'Đang phát: Đủ nắng hoa sẽ nở 🌸';
    }).catch(err => {
      // Browser autoplay restriction, ready for user click
      console.log('Autoplay restriction, click anywhere to start audio.');
      musicStatus.textContent = 'Nhấn vào web để phát nhạc ✨';
    });
  }

  function pauseSong() {
    if (!bgmAudio) return;
    bgmAudio.pause();
    isPlayingMusic = false;
    vinylDisc.classList.remove('playing');
    musicStatus.textContent = 'Đã tạm dừng';
  }

  function toggleMusic() {
    if (isPlayingMusic) {
      pauseSong();
    } else {
      playSong();
    }
  }

  if (musicWidget) {
    musicWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // TỰ ĐỘNG PHÁT NHẠC NGAY KHI NHẤN VÀO WEB
  const startAudioOnFirstInteraction = () => {
    if (!isPlayingMusic) {
      playSong();
    }
    document.removeEventListener('click', startAudioOnFirstInteraction);
    document.removeEventListener('touchstart', startAudioOnFirstInteraction);
  };
  document.addEventListener('click', startAudioOnFirstInteraction, { once: true });
  document.addEventListener('touchstart', startAudioOnFirstInteraction, { once: true });

  // Thử tự động phát ngay khi trang vừa tải xong
  playSong();

  // 4. CTA BUTTON
  const heroCtaBtn = document.getElementById('hero-cta-btn');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', () => {
      if (!isPlayingMusic) {
        playSong();
      }
      const target = document.getElementById('section-why');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 5. INTERACTIVE GIFT BOX & VOUCHER MODAL
  const giftBoxTrigger = document.getElementById('gift-box-trigger');
  const modalOverlay = document.getElementById('modal-voucher');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (giftBoxTrigger && modalOverlay) {
    giftBoxTrigger.addEventListener('click', () => {
      if (!isPlayingMusic) {
        playSong();
      }
      modalOverlay.classList.add('active');
    });

    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // 6. LIGHTBOX MODAL FOR POLAROIDS
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const allPolaroids = document.querySelectorAll('.gallery-polaroid, .polaroid');
  allPolaroids.forEach((pol) => {
    pol.addEventListener('click', () => {
      const img = pol.querySelector('img');
      const badgeOrCaption = pol.querySelector('.polaroid-badge, .gallery-caption');
      if (img && lightboxOverlay) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = badgeOrCaption ? badgeOrCaption.textContent.trim() : 'Thủy Tiên ✨';
        lightboxOverlay.classList.add('active');
      }
    });
  });

  if (lightboxOverlay) {
    lightboxClose.addEventListener('click', () => {
      lightboxOverlay.classList.remove('active');
    });
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        lightboxOverlay.classList.remove('active');
      }
    });
  }
});
