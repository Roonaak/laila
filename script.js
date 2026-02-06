// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const pages = [...document.querySelectorAll(".page")];

function showPage(id){
  pages.forEach(p => p.classList.remove("active"));
  const el = document.getElementById(id);
  if(el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Music ----------
const music = $("#bgMusic");
const musicBtn = $("#musicBtn");
const vol = $("#vol");

vol.addEventListener("input", () => {
  music.volume = Number(vol.value);
});

async function toggleMusic(forcePlay=false){
  try{
    if(forcePlay || music.paused){
      await music.play();
      musicBtn.textContent = "🔇 Pause";
    }else{
      music.pause();
      musicBtn.textContent = "🔊 Play";
    }
  }catch(e){
    // autoplay blocked until user clicks
    musicBtn.textContent = "🔊 Play";
  }
}
musicBtn.addEventListener("click", () => toggleMusic());

// Start music on first user interaction anywhere
let firstTap = true;
document.addEventListener("click", () => {
  if(firstTap){
    firstTap = false;
    toggleMusic(true);
  }
}, { once: true });

// ---------- Page Navigation ----------
document.addEventListener("click", (e) => {
  const next = e.target.getAttribute?.("data-next");
  const back = e.target.getAttribute?.("data-back");
  if(next) showPage(next);
  if(back) showPage(back);
});

// ---------- “NO” button escapes ----------
const noBtn = $("#noBtn");
const yesBtn = $("#yesBtn");
const page1 = $("#page1");

function moveNoButton(){
  const rect = page1.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Safe area inside the card
  const padding = 20;
  const maxX = rect.width - btnRect.width - padding;
  const maxY = rect.height - btnRect.height - padding;

  const x = Math.random() * maxX + padding/2;
  const y = Math.random() * maxY + padding/2;

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); moveNoButton(); }, { passive:false });

yesBtn.addEventListener("click", () => {
  showPage("page2");
  burstHearts(18);
});

// ---------- Quiz ----------
const quizResult = $("#quizResult");
document.querySelectorAll(".quizOpt").forEach(btn => {
  btn.addEventListener("click", () => {
    if(btn.classList.contains("correct")){
      quizResult.classList.remove("hidden");
      burstHearts(14);
    }else{
      quizResult.classList.remove("hidden");
      quizResult.textContent = "😌 Nice try… but correct answer is: Obviously, You 💗";
    }
  });
});

// ---------- Floating hearts background ----------
const heartsWrap = document.querySelector(".hearts");
const heartEmojis = ["💗","💖","💘","💝","💕","❤️"];

function spawnHeart(){
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
  h.style.left = Math.random()*100 + "vw";
  h.style.animationDuration = (4 + Math.random()*4) + "s";
  h.style.fontSize = (14 + Math.random()*20) + "px";
  heartsWrap.appendChild(h);
  setTimeout(() => h.remove(), 9000);
}
setInterval(spawnHeart, 450);

// little heart burst
function burstHearts(count=10){
  for(let i=0;i<count;i++){
    setTimeout(spawnHeart, i*40);
  }
}

// ---------- Confetti ----------
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiOn = false;

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function makeConfetti(n=180){
  confettiPieces = Array.from({length:n}).map(() => ({
    x: Math.random()*canvas.width,
    y: -20 - Math.random()*canvas.height*0.3,
    r: 2 + Math.random()*4,
    vx: -1 + Math.random()*2,
    vy: 2 + Math.random()*5,
    rot: Math.random()*Math.PI,
    vrot: -0.2 + Math.random()*0.4
  }));
}

function drawConfetti(){
  if(!confettiOn) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillRect(-p.r, -p.r, p.r*2.4, p.r*2.4);
    ctx.restore();

    // wrap
    if(p.y > canvas.height + 40){
      p.y = -20;
      p.x = Math.random()*canvas.width;
    }
  });

  requestAnimationFrame(drawConfetti);
}

$("#confettiBtn").addEventListener("click", () => {
  confettiOn = true;
  makeConfetti(220);
  drawConfetti();

  // auto stop after 4 sec
  setTimeout(() => {
    confettiOn = false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }, 4000);
});
