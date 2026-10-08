// Interactive Apology Application

const defaultData = {
  recipientName: "Dearest T",
  senderName: "Someone who cares deeply & owes you peace",
  videoCaption: "Speaking to you honestly, without pride or excuses 🥺",
  letterP1: "I come in peace, wave the white flag, and formally admit I messed up. Seeing you hurt and stressed because of me is the absolute worst feeling, and I am genuinely sorry.",
  letterP2: "My emotional communication skills clearly need a massive software update. I get so tangled up trying to say the right thing that I end up saying the completely wrong thing, making me look like an aloof jerk. Please don’t mistake my clumsy brain for not caring.",
  letterP3: "You’re hands down the most amazing person in my world, and talking to you is my ultimate comfort zone. Even in an alternate timeline where we don’t end up together, I’d still be in your corner rooting for you.",
  letterP4: "I really hope you can forgive my chaotic communication and remember that underneath all my clumsiness, I truly care about you."
};

let currentData = { ...defaultData };
let angerLevel = 99;
let noAttempts = 0;
let yesScale = 1;
let isAudioPlaying = false;
let audioCtx = null;
let musicInterval = null;

// Dynamic video captions
const videoCaptions = [
  "Speaking to you honestly, without pride or excuses 🥺",
  "I am truly sorry for how I acted, T, and I take full responsibility 🤍",
  "No pride, no defenses—I was in the wrong and I own it 🤝",
  "Your peace of mind matters deeply to me, and it hurts knowing I disturbed it 🙏",
  "All I hope for is that you find a quiet space in your heart to forgive me 🤍"
];

// Polite dodging phrases
const dodgeQuotes = [
  "Hear me out for just a moment, T... your feelings matter too much to leave this unresolved 🥺",
  "I take full accountability for my mistakes, T, and I'm ready to make things right 🤝",
  "Even this little cat is rooting for our peace and understanding, T... 🥺",
  "I truly learned from this, T, and I won't ever repeat the same mistake 🙏",
  "Let's clear away the tension so there's only lightness and calm between us ✨",
  "I know I fell short, but please don't close the door just yet... 🥺",
  "Let's leave the hurt behind so your heart can breathe easily again, T 🤍"
];

document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  initParticles();
  setupEventListeners();
  initFXCanvas();
  startCaptionCycle();

  // تشغيل الموسيقى الهادئة عند أول تفاعل
  window.addEventListener("click", tryAutoPlayAudioOnce, { once: true });
  window.addEventListener("touchstart", tryAutoPlayAudioOnce, { once: true });
});

function tryAutoPlayAudioOnce() {
  if (!isAudioPlaying) {
    startMusic();
  }
}

// إدارة التخزين المحلي
function loadSavedData() {
  const saved = localStorage.getItem("apology_card_data_pure");
  if (saved) {
    try {
      currentData = { ...defaultData, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
  }
  updateDOM();
}

function updateDOM() {
  const nameEl = document.getElementById("display-name");
  if (nameEl) nameEl.textContent = currentData.recipientName;

  const senderEl = document.getElementById("sender-display");
  if (senderEl) senderEl.textContent = currentData.senderName;

  const captionEl = document.getElementById("video-caption");
  if (captionEl && currentData.videoCaption) {
    captionEl.textContent = `"${currentData.videoCaption}"`;
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' });
  const admitDateEl = document.getElementById("admit-date");
  const confessionDateEl = document.getElementById("confession-date");
  if (admitDateEl) admitDateEl.textContent = formattedDate;
  if (confessionDateEl) confessionDateEl.textContent = formattedDate;
}

// بريق وقلوب ناعمة متحركة في الخلفية
function initParticles() {
  const container = document.getElementById("ambient-particles");
  if (!container) return;

  const items = ["✨", "🤍", "🌸", "🌷", "✨"];

  function createParticle() {
    const el = document.createElement("div");
    el.className = "romantic-particle";
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = (Math.random() * 95) + "vw";
    el.style.fontSize = (Math.random() * 16 + 14) + "px";
    const duration = Math.random() * 5 + 6;
    el.style.animationDuration = duration + "s";
    container.appendChild(el);

    setTimeout(() => el.remove(), duration * 1000);
  }

  for (let i = 0; i < 10; i++) {
    setTimeout(createParticle, i * 400);
  }
  setInterval(createParticle, 900);
}

// الأحداث والتفاعل
function setupEventListeners() {
  // منع السكرول قبل الضغط على الزر
  function blockScroll(e) {
    if (document.body.classList.contains("no-scroll")) {
      e.preventDefault();
    }
  }
  window.addEventListener("wheel", blockScroll, { passive: false });
  window.addEventListener("touchmove", blockScroll, { passive: false });

  // زر البداية في شاشة القفل
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // فك قفل السكرول
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);

      document.getElementById("intro-screen").classList.remove("active");
      startMusic();
      playSoftChime();

      const mainVid = document.getElementById("apology-video");
      if (mainVid) {
        mainVid.play().catch(() => {});
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // زر "لا" المراوغ
  const noBtn = document.getElementById("no-btn");
  if (noBtn) {
    noBtn.addEventListener("mouseenter", handleNoDodge);
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleNoDodge();
    });
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleNoDodge();
    });
  }

  // زر "مسامحاك"
  const yesBtn = document.getElementById("yes-btn");
  if (yesBtn) {
    yesBtn.addEventListener("click", handleYesVictory);
  }

  // زرار التأكيد في شاشة القبول
  const victoryShowerBtn = document.getElementById("victory-shower-btn");
  if (victoryShowerBtn) {
    victoryShowerBtn.addEventListener("click", () => {
      fireFireworks();
      playVictoryJingle();
      showToast("شكراً ليكي على كرم أخلاقك ومسامحتك! 🤍");
    });
  }
}

// التحكم في فيديوهات القطط حسب الاختيارات
let captionInterval = null;

function switchMainVideo(src, badgeText, captionText) {
  const videoEl = document.getElementById("apology-video");
  const badgeEl = document.getElementById("video-badge");
  const captionEl = document.getElementById("video-caption");

  if (videoEl) {
    videoEl.classList.add("video-fade");
    setTimeout(() => {
      // تحديث مصدر الفيديو إذا اختلف
      if (!videoEl.src.includes(src)) {
        videoEl.src = src;
        videoEl.load();
        videoEl.play().catch(() => {});
      }
      videoEl.classList.remove("video-fade");
    }, 220);
  }

  if (badgeEl && badgeText) {
    badgeEl.style.opacity = "0";
    badgeEl.style.transform = "scale(0.92)";
    setTimeout(() => {
      badgeEl.textContent = badgeText;
      badgeEl.style.opacity = "1";
      badgeEl.style.transform = "scale(1)";
    }, 200);
  }

  if (captionEl && captionText) {
    captionEl.style.opacity = "0";
    captionEl.style.transform = "scale(0.96)";
    setTimeout(() => {
      captionEl.textContent = `"${captionText}"`;
      captionEl.style.opacity = "1";
      captionEl.style.transform = "scale(1)";
    }, 200);
  }
}

// تدوير الجمل فوق الصورة
function startCaptionCycle() {
  const captionEl = document.getElementById("video-caption");
  if (!captionEl) return;
  let idx = 0;

  captionInterval = setInterval(() => {
    // إذا اختار المستخدم اختياراً صريحاً نوقف التدوير العشوائي ليظل كلام الاعتذار ثابتاً
    if (selectedChoices.admit || selectedChoices.confession) return;

    idx = (idx + 1) % videoCaptions.length;
    captionEl.style.opacity = "0";
    captionEl.style.transform = "scale(0.96)";

    setTimeout(() => {
      captionEl.textContent = `"${videoCaptions[idx]}"`;
      captionEl.style.opacity = "1";
      captionEl.style.transform = "scale(1)";
    }, 250);
  }, 4500);
}

// مؤشر تخفيف الزعل وعرض المحتوى والفيديو حسب الاختيار
const selectedChoices = { admit: false, confession: false };

window.defuseAnger = function(type) {
  const bar = document.getElementById("progress-bar");
  const val = document.getElementById("meter-val");
  const desc = document.getElementById("meter-desc");
  const chipAdmit = document.getElementById("chip-admit");
  const chipConfession = document.getElementById("chip-confession");
  const contentAdmit = document.getElementById("content-admit");
  const contentConfession = document.getElementById("content-confession");

  if (type === "admit") {
    if (!selectedChoices.admit) {
      selectedChoices.admit = true;
      angerLevel = Math.max(0, angerLevel - 50);
    }
    if (chipAdmit) chipAdmit.classList.add("active-choice");
    if (contentAdmit) contentAdmit.classList.add("revealed");

    // تشغيل فيديو الاعتراف الصريح والركوع/الاعتذار
    switchMainVideo(
      "assets/cat_admit.mp4",
      "معترف بغلطي ومفيش أي تبرير 🙇‍♂️🙏",
      "أنا عارف إني غلطت وتصرفت غلط.. وحقك على راسي وعيني 🙏"
    );

    playSoftChime(660);
    showToast("تم فتح إقرار الاعتراف الكامل بالخطأ 🤍");
    desc.textContent = "تم إقرار الخطأ رسمياً وبدون أي مبررات أو أعذار.";

    setTimeout(() => {
      if (contentAdmit) contentAdmit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  } else if (type === "confession") {
    if (!selectedChoices.confession) {
      selectedChoices.confession = true;
      angerLevel = Math.max(0, angerLevel - 50);
    }
    if (chipConfession) chipConfession.classList.add("active-choice");
    if (contentConfession) contentConfession.classList.add("revealed");

    // تشغيل فيديو طلب المسامحة بعيون بريئة وصادقة
    switchMainVideo(
      "assets/cat_confession.mp4",
      "كل اللي بتمناه بجد إنك تسامحيني 🥺🤍",
      "زعلك تقيل عليا ومش هين.. كل اللي طالبه هو المسامحة وتصفية الخاطر 📜"
    );

    playPopSound(520);
    showToast("تم فتح طلب المسامحة والعفو 📜");
    desc.textContent = "كل اللي بطلبه هو المسامحة وتصفية الخاطر.";

    setTimeout(() => {
      if (contentConfession) contentConfession.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }

  // تحديث شريط ونسبة الزعل
  if (bar) bar.style.width = angerLevel + "%";
  if (val) {
    val.textContent = angerLevel + "%";
    if (angerLevel <= 50 && angerLevel > 0) {
      val.style.color = "#ffb703";
      val.style.background = "#fff8e6";
      bar.style.background = "linear-gradient(90deg, #ffb703, #fb8500)";
    }
    if (angerLevel === 0) {
      val.textContent = "0% (زال الزعل) 🤍";
      val.style.color = "#2ec4b6";
      val.style.background = "#e6faf8";
      bar.style.background = "linear-gradient(90deg, #2ec4b6, #208b81)";
      desc.textContent = "🎉 تم إنهاء الزعل! مستني موافقتك على الاعتذار والمسامحة.";

      // تشغيل فيديو الرجاء والأمل في المسامحة
      setTimeout(() => {
        switchMainVideo(
          "assets/cat_relieved.mp4",
          "مستني مسامحتك على نار 🥺✨",
          "زال الزعل من جواكي؟ مستني تدوسي مسامحاك علشان أرتاح! 🤝🤍"
        );
      }, 700);

      setTimeout(() => {
        const arena = document.getElementById("forgiveness-arena");
        if (arena) arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }

  fireConfettiBurst();
};

// حركة زر "لا" المراوغة
function handleNoDodge() {
  const arena = document.getElementById("buttons-playground");
  const noBtn = document.getElementById("no-btn");
  const yesBtn = document.getElementById("yes-btn");
  const sub = document.getElementById("dodge-sub");
  const counter = document.getElementById("dodge-counter");

  if (!arena || !noBtn || !yesBtn) return;

  noAttempts++;

  // تحديث الجملة
  const quote = dodgeQuotes[Math.min(noAttempts - 1, dodgeQuotes.length - 1)];
  if (sub) {
    sub.textContent = quote;
    sub.style.color = "#ff3366";
    sub.style.fontWeight = "700";
    sub.style.transform = "scale(1.03)";
  }

  if (counter) {
    counter.textContent = `محاولات رفض الاعتذار: ${noAttempts} 😂`;
  }

  // حركة محسوبة بدقة داخل حدود الحلبة دون الخروج من الشاشة
  const arenaRect = arena.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const safeMaxX = Math.max(10, Math.floor((arenaRect.width - btnRect.width) / 2) - 12);
  const safeMaxY = Math.max(10, Math.floor((arenaRect.height - btnRect.height) / 2) - 8);

  const randX = (Math.random() * 2 - 1) * safeMaxX;
  const randY = (Math.random() * 2 - 1) * safeMaxY;

  noBtn.style.position = "relative";
  noBtn.style.transform = `translate(${randX.toFixed(1)}px, ${randY.toFixed(1)}px)`;

  // تكبير زر "مسامحاك" تدريجياً وبنسبة تتناسب مع حجم شاشة الموبايل أو الكمبيوتر
  const maxYesScale = window.innerWidth < 420 ? 1.35 : (window.innerWidth < 768 ? 1.55 : 1.85);
  yesScale = Math.min(yesScale + 0.08, maxYesScale);
  yesBtn.style.transform = `scale(${yesScale.toFixed(2)})`;

  playPopSound(420);
}

// الضغط على قبول الاعتذار
function handleYesVictory() {
  const victoryScreen = document.getElementById("victory-screen");
  if (victoryScreen) {
    victoryScreen.classList.add("active");
  }

  const happyVideo = document.getElementById("happy-video");
  if (happyVideo) {
    happyVideo.play().catch(() => {});
  }

  switchMainVideo(
    "assets/cat_happy.mp4",
    "الحمد لله إنك قبلتِ اعتذاري وسامحتيني! 🎉🥳",
    "الحمد لله يا رب.. النفوس صافية وخلاص صفيناها! 🤝🤍"
  );

  fireFireworks();
  playVictoryJingle();
  showToast("الحمد لله إنك قبلتِ اعتذاري! 🤝✨");
}

// نظام الصوت الهادئ (Web Audio API)
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playNote(freq, type = "sine", duration = 0.9, delay = 0, vol = 0.08) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function playSoftChime(freq = 587.33) {
  initAudio();
  playNote(freq, "sine", 0.8, 0, 0.09);
  playNote(freq * 1.5, "sine", 1.0, 0.08, 0.05);
}

function playPopSound(freq = 460) {
  initAudio();
  playNote(freq, "sine", 0.12, 0, 0.09);
}

function playVictoryJingle() {
  initAudio();
  const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  chord.forEach((freq, idx) => {
    playNote(freq, "sine", 1.5, idx * 0.12, 0.12);
  });
}

let bgMusic = null;

function initBgMusic() {
  if (!bgMusic) {
    bgMusic = document.getElementById("bg-music");
    if (!bgMusic) {
      bgMusic = new Audio("assets/bg_music.mp3");
    }
    bgMusic.loop = true;
    bgMusic.volume = 0.55;
  }
}

function startMusic() {
  initBgMusic();
  if (bgMusic) {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
    }).catch((err) => {
      // Browser autoplay policy might require interaction
      console.log("Audio waiting for user gesture:", err);
    });
  }
}

// الإشعار المنبثق
function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

// محرك الاحتفالات
let fxParticles = [];
let animId = null;

function initFXCanvas() {
  const canvas = document.getElementById("fx-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.009;

      if (p.opacity <= 0 || p.y > canvas.height + 30) {
        fxParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(p.opacity, 0);

      if (p.emoji) {
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      ctx.restore();
    }

    animId = requestAnimationFrame(loop);
  }

  loop();
}

function fireConfettiBurst() {
  const colors = ["#ff3366", "#ff6584", "#2ec4b6", "#ffb703", "#ffffff"];
  const emojis = ["🤍", "✨", "🌸", "🌷"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.45;

  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    const isEmoji = Math.random() > 0.6;
    fxParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      gravity: 0.16,
      size: isEmoji ? 20 : (Math.random() * 8 + 6),
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      opacity: 1
    });
  }
}

function fireFireworks() {
  fireConfettiBurst();
  let count = 0;
  const timer = setInterval(() => {
    fireConfettiBurst();
    count++;
    if (count > 6) clearInterval(timer);
  }, 600);
}
