(function(){
  "use strict";

  /* ---------- ambient sparkles ---------- */
  const field = document.getElementById('sparkleField');
  const sparkleColors = ['#fff','#ffe9f2','#eaf4ff'];
  for(let i=0;i<26;i++){
    const s = document.createElement('span');
    const size = 2 + Math.random()*3;
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.left = Math.random()*100+'vw';
    s.style.bottom = (Math.random()*20-10)+'vh';
    s.style.background = sparkleColors[Math.floor(Math.random()*sparkleColors.length)];
    s.style.animationDuration = (8+Math.random()*10)+'s';
    s.style.animationDelay = (Math.random()*10)+'s';
    field.appendChild(s);
  }

  /* ---------- loader terminal typing ---------- */
  const terminal = document.getElementById('terminalText');
  const lines = [
    {text:'Initializing birthday surprise...', cls:''},
    {text:'Warning ⚠️: A lot of flattery and extreme cringeness have been detected.', cls:'warn'},
    {text:'Proceeding anyway...', cls:'warn'}
  ];
  let li = 0, ci = 0;
  function typeLine(){
    if(li >= lines.length){
      document.getElementById('greetingBlock').classList.add('show');
      return;
    }
    const line = lines[li];
    if(ci === 0){
      const p = document.createElement('div');
      p.className = line.cls;
      p.innerHTML = '&nbsp;';
      terminal.appendChild(p);
    }
    const currentP = terminal.lastElementChild;
    ci++;
    currentP.textContent = line.text.slice(0, ci);
    if(ci < line.text.length){
      setTimeout(typeLine, 18);
    } else {
      li++; ci = 0;
      setTimeout(typeLine, 350);
    }
  }
  setTimeout(typeLine, 400);

  /* ---------- screen navigation helper ---------- */
  function show(id){
    document.querySelectorAll('.screen').forEach(el=>el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
  }

  document.getElementById('enterBtn').addEventListener('click', ()=> show('screen-song'));

  /* ---------- song selection ---------- */
  const bgAudio = document.getElementById('bgAudio');
  const songSources = {
    '1': 'assets/Humdard - Arijit Singh  Ek villain  Jo Tu Mera Humdard Hai.mp3',
    '2': 'assets/Mithoon, Papon - Humnava (Lyrics).mp3',
  };
  document.querySelectorAll('#screen-song .choice-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      document.querySelectorAll('#screen-song .choice-card').forEach(c=>c.classList.remove('picked'));
      card.classList.add('picked');
      const key = card.dataset.song;
      bgAudio.src = songSources[key];
      bgAudio.volume = 0.5;
      bgAudio.play().catch(()=>{ /* file not connected yet — that's fine, site still continues */ });
      setTimeout(()=> show('screen-nick'), 350);
    });
  });

  /* ---------- nickname selection ---------- */
  let selectedNickname = 'you'; // fallback if nothing's picked yet

  document.querySelectorAll('#screen-nick .choice-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      document.querySelectorAll('#screen-nick .choice-card').forEach(c=>c.classList.remove('picked'));
      card.classList.add('picked');

      const emojiSpan = card.querySelector('.emoji');
      selectedNickname = card.textContent.replace(emojiSpan.textContent, '').trim();

      document.getElementById('confirmNickname').textContent = selectedNickname;
      document.getElementById('nickConfirm').classList.add('show');
      setTimeout(()=>{
        document.getElementById('screen-nick').classList.add('hidden');
        document.getElementById('mainSite').classList.remove('hidden');
      }, 1400);
    });
  });

  

  /* ---------- quest rail navigation ---------- */
const STEP_ORDER = ['chaos','garden','surprises','celebrate','feedback'];
let unlockedStep = 1;
let currentStep = 1;

function goToPage(target){
  document.querySelectorAll('section.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+target).classList.add('active');
  currentStep = STEP_ORDER.indexOf(target) + 1;
  updateQuestRail();
  window.scrollTo({top:0, behavior:'smooth'});
}

function unlockStep(n){
  if(n > unlockedStep){
    unlockedStep = n;
  }
  updateQuestRail();
}

function updateQuestRail(){
  document.querySelectorAll('.quest-node').forEach(node=>{
    const step = parseInt(node.dataset.step, 10);
    node.classList.remove('current','completed','locked');
    if(step < currentStep && step <= unlockedStep){
      node.classList.add('completed');
    } else if(step === currentStep){
      node.classList.add('current');
    } else if(step > unlockedStep){
      node.classList.add('locked');
    }
  });
}

const questTooltip = document.createElement('div');
questTooltip.className = 'quest-tooltip';
questTooltip.textContent = "Step by step agaite hobe ma'am 🥰";
document.body.appendChild(questTooltip);

document.querySelectorAll('.quest-node').forEach(node=>{
  node.addEventListener('click', ()=>{
    const step = parseInt(node.dataset.step, 10);
    if(step <= unlockedStep){
      goToPage(node.dataset.target);
    } else {
      node.classList.add('shake');
      setTimeout(()=> node.classList.remove('shake'), 400);
      const rect = node.getBoundingClientRect();
      questTooltip.style.top = rect.top + 'px';
      questTooltip.classList.add('show');
      setTimeout(()=> questTooltip.classList.remove('show'), 1400);
    }
  });
});

document.querySelectorAll('.continue-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const nextTarget = btn.dataset.next;
    const nextStep = STEP_ORDER.indexOf(nextTarget) + 1;
    unlockStep(nextStep);
    goToPage(nextTarget);
  });
});

updateQuestRail();

  /* ---------- hidden surprises ---------- */
  const revealContent = {
    star: {title:'⭐ hidden message', text:'Okay, fine, ami tore actually halka patla miss kortesi eibar, age kortam na jodio (sure na) 🙄😒'},
    gift: {title:'🎁 surprise', text:'SURPRISE!!! 😛😍',
        image:'assets/Bangladesh_BB_20_taka_2025.00.00_B367a_PNL_কক_4870784_f-465x219.jpg'
    },
    cute: {title:'🌸 a cute note',
       text:'Hi kuchupuchu meowwww okie dokie?? 🥺',
        image:'assets/hatsune-ryaiku-quirky.gif'
},
    book: {
      title:'📖 the birthday letter',
      text:"Bhai re bhai, abar letter!! \n\nHappy Birthday, {{NICKNAME}}!! 🥳\n\nSo, ami bhalo korei likhar cheshta kortesi, bhul truti hoile khoma korar dorkar nai 😛 Ami just bolte chacchilam je tui actually onek bhalo, hae tuktak mittha kotha bolleo mon neat and clean. \n\nJai hok, dekhte dekhte onek boro hoye geli, shei choto thakte tore dekhsilam. Arekta important kotha, tor mathai na onek shomossha ase, ekjon bhalo psychiatrists dekhais 🤭\n\nThat's all, tui to janos e je ami bhalo kotha beshi ekta bolte pari nah. Ar na janle ekhon jani ne 😛\n\n— Hulku 🧌"
    }
  };
document.querySelectorAll('.surprise-icon').forEach(icon=>{
  icon.addEventListener('click', ()=>{
    const key = icon.dataset.reveal;
    const data = revealContent[key];
    document.getElementById('revealTitle').textContent = data.title;

    let text = data.text;
    if(key === 'book'){
      text = text.replace('{{NICKNAME}}', selectedNickname);
    }
    document.getElementById('revealText').textContent = text;

    const imgEl = document.getElementById('revealImage');
    if(data.image){
      imgEl.src = data.image;
      imgEl.classList.remove('hidden');
    } else {
      imgEl.src = '';
      imgEl.classList.add('hidden');
    }

    revealModal.classList.add('show');
  });
});
  document.getElementById('revealClose').addEventListener('click', ()=> revealModal.classList.remove('show'));
  revealModal.addEventListener('click', (e)=>{ if(e.target === revealModal) revealModal.classList.remove('show'); });

  /* ---------- celebration scene ---------- */
  const starSky = document.getElementById('starSky');
  for(let i=0;i<40;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*70+'%';
    s.style.animationDelay = (Math.random()*2)+'s';
    starSky.appendChild(s);
  }

  /* simple beep/pop sounds — no audio files needed */
  let audioCtx;
  function playTone(freq, duration, type){
    try{
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    }catch(e){ /* audio not supported — fail silently */ }
  }

  let celebrated = false;
  const launchBtn = document.getElementById('celebrate-launch');
  const countdownOverlay = document.getElementById('countdownOverlay');
  const countdownNum = document.getElementById('countdownNum');
  const cakeScene = document.getElementById('cakeScene');
  const blowHint = document.getElementById('blowHint');

  launchBtn.addEventListener('click', ()=>{
    if(celebrated) return;
    launchBtn.disabled = true;
    launchBtn.style.opacity = '0.5';
    runCountdown(3, ()=>{
      countdownOverlay.classList.add('hidden');
      cakeScene.style.display = 'flex';
      setupCandles();
    });
  });

  function runCountdown(n, onDone){
    countdownOverlay.classList.remove('hidden');
    countdownNum.textContent = n;
    countdownNum.style.animation = 'none';
    void countdownNum.offsetWidth;
    countdownNum.style.animation = '';
    playTone(440, 0.2, 'triangle');
    if(n <= 1){
      setTimeout(onDone, 700);
      return;
    }
    setTimeout(()=> runCountdown(n-1, onDone), 800);
  }

  function setupCandles(){
    const candles = document.querySelectorAll('.candle');
    let remaining = candles.length;
    candles.forEach(candle=>{
      candle.addEventListener('click', function handler(){
        if(candle.classList.contains('out')) return;
        candle.classList.add('out');
        candle.textContent = '💨';
        playTone(200 + Math.random()*80, 0.3, 'sawtooth');
        remaining--;
        if(remaining === 0){
          blowHint.textContent = "ghee khatam 🥀";
          setTimeout(fullCelebration, 500);
        }
      }, {once:true});
    });
  }

  function fullCelebration(){
    celebrated = true;
    document.getElementById('celebrateHeading').style.display = 'block';
    document.getElementById('celebrateNickname').textContent = selectedNickname;
    document.getElementById('celebrateSub').style.display = 'block';
    launchBtn.style.display = 'none';
    playTone(523, 0.15, 'sine');
    setTimeout(()=>playTone(659, 0.15, 'sine'), 150);
    setTimeout(()=>playTone(784, 0.3, 'sine'), 300);
    launchFireworks();
    launchConfetti();
    launchBalloons();
    launchStreamers();
    unlockStep(5);
    document.getElementById('continueToFeedback').classList.remove('hidden');
  }

  function launchFireworks(){
    const layer = document.getElementById('fireworksLayer');
    const colors = ['#ff8fab','#ffe066','#9ad0ff','#c8a2f0','#7fe0a8'];
    for(let burst=0; burst<9; burst++){
      setTimeout(()=>{
        const cx = 15 + Math.random()*70;
        const cy = 15 + Math.random()*40;
        for(let p=0;p<18;p++){
          const dot = document.createElement('span');
          dot.className = 'fw';
          dot.style.left = cx+'%';
          dot.style.top = cy+'%';
          dot.style.background = colors[Math.floor(Math.random()*colors.length)];
          layer.appendChild(dot);
          const angle = (p/18)*Math.PI*2;
          const dist = 40 + Math.random()*40;
          const dx = Math.cos(angle)*dist;
          const dy = Math.sin(angle)*dist;
          dot.animate([
            {transform:'translate(0,0) scale(1)', opacity:1},
            {transform:`translate(${dx}px, ${dy}px) scale(0.3)`, opacity:0}
          ], {duration:900+Math.random()*400, easing:'cubic-bezier(.2,.8,.2,1)'});
          setTimeout(()=>dot.remove(), 1300);
        }
      }, burst*450);
    }
  }

  function launchConfetti(){
    const layer = document.getElementById('confettiLayer');
    const colors = ['#ff8fab','#ffe066','#9ad0ff','#c8a2f0','#7fe0a8','#fff'];
    for(let i=0;i<50;i++){
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random()*100+'%';
      piece.style.width = (5+Math.random()*5)+'px';
      piece.style.height = (8+Math.random()*8)+'px';
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      layer.appendChild(piece);
      piece.animate([
        {transform:'translateY(0) rotate(0deg)', opacity:1},
        {transform:`translateY(${300+Math.random()*200}px) rotate(${360+Math.random()*360}deg)`, opacity:0.9, offset:0.85},
        {transform:`translateY(${340+Math.random()*220}px) rotate(${420+Math.random()*360}deg)`, opacity:0}
      ], {duration:2200+Math.random()*1200, delay:Math.random()*600, easing:'ease-in'});
      setTimeout(()=>piece.remove(), 4200);
    }
  }
  function launchBalloons(){
    const layer = document.getElementById('balloonsLayer');
    const colors = ['#ff8fab','#ffe066','#9ad0ff','#c8a2f0','#7fe0a8'];
    for(let i=0;i<14;i++){
      const b = document.createElement('div');
      b.className = 'balloon';
      const size = 30 + Math.random()*20;
      b.style.width = size+'px';
      b.style.height = (size*1.2)+'px';
      b.style.left = Math.random()*90+'%';
      b.style.background = colors[Math.floor(Math.random()*colors.length)];
      layer.appendChild(b);
      b.animate([
        {transform:'translateY(0) rotate(0deg)', opacity:0.95},
        {transform:`translateY(-${400+Math.random()*200}px) rotate(${Math.random()*30-15}deg)`, opacity:0}
      ], {duration:4000+Math.random()*2000, delay:Math.random()*800, easing:'ease-out'});
      setTimeout(()=>b.remove(), 7000);
    }
  }

  function launchStreamers(){
    const layer = document.getElementById('streamersLayer');
    const colors = ['#ff8fab','#ffe066','#9ad0ff','#c8a2f0','#7fe0a8','#fff'];
    for(let i=0;i<24;i++){
      const s = document.createElement('div');
      s.className = 'streamer';
      s.style.left = Math.random()*100+'%';
      s.style.height = (40+Math.random()*40)+'px';
      s.style.background = colors[Math.floor(Math.random()*colors.length)];
      layer.appendChild(s);
      s.animate([
        {transform:'translateY(0) rotate(0deg)', opacity:1},
        {transform:`translateY(${300+Math.random()*200}px) rotate(${180+Math.random()*180}deg)`, opacity:0}
      ], {duration:2500+Math.random()*1500, delay:Math.random()*500, easing:'ease-in'});
      setTimeout(()=>s.remove(), 4500);
    }
  }

  /* ---------- feedback form ---------- */
const feedbackForm = document.getElementById('feedbackForm');
const feedbackStatus = document.getElementById('feedbackStatus');
feedbackForm.addEventListener('submit', function(e){
  e.preventDefault();
  const actionUrl = feedbackForm.getAttribute('action') || '';

  function setStatus(html, type){
    feedbackStatus.innerHTML = html;
    feedbackStatus.classList.remove('success','error');
    if(type) feedbackStatus.classList.add(type);
    feedbackStatus.classList.add('show');
  }

  if(actionUrl.includes('YOUR_FORM_ID')){
    setStatus('<span class="status-icon">⚠️</span><span>Not connected yet — swap the form\'s action URL for a real Formspree or Google Form link to make this live. Your message wasn\'t lost, just not sent: "' + feedbackForm.message.value.slice(0,120) + (feedbackForm.message.value.length>120 ? '…' : '') + '"</span>', 'error');
    return;
  }

  setStatus('<span class="status-icon">🚀</span><span>Sending...</span>', null);
  const submitBtn = feedbackForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  fetch(actionUrl, {
    method: 'POST',
    body: new FormData(feedbackForm),
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if(response.ok){
      setStatus('<span class="status-icon">✅</span><span>Sent, Thank You! 😍</span>', 'success');
      feedbackForm.reset();
    } else {
      setStatus('<span class="status-icon">❌</span><span>Kono kechal hoise, abar try kor to?? 🤔</span>', 'error');
    }
  })
  .catch(() => {
    setStatus('<span class="status-icon">❌</span><span>Tor connection check kore abar send kor.</span>', 'error');
  })
  .finally(() => {
    submitBtn.disabled = false;
  });
});

})();
