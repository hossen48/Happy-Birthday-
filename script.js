const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let page = 0;
let musicOn = false;
const pages = $$('.page');
const pageCount = $('#pageCount');

function updateCounter(){
  pageCount.textContent = String(page+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');
}
function go(n){
  if(n<0 || n>=pages.length) return;
  const old = pages[page], next = pages[n];
  if(old===next) return;
  old.classList.remove('active'); old.classList.add('leaving');
  setTimeout(()=>old.classList.remove('leaving'),850);
  next.classList.add('active');
  page=n; updateCounter();
  window.scrollTo({top:0,behavior:'instant'});
  if(page===5) renderTerminal();
}
$$('.next').forEach(b=>b.addEventListener('click',()=>go(page+1)));

function startMusic(){
  const a=$('#bgm'); if(!a)return;
  a.volume=.38;
  const p=a.play(); if(p?.catch)p.catch(()=>{});
  musicOn=true; $('#musicLabel').textContent='soundtrack on ♫';
}
function toggleMusic(){
  const a=$('#bgm'); if(!a)return;
  if(a.paused) startMusic(); else {a.pause(); musicOn=false; $('#musicLabel').textContent='soundtrack off';}
}
$('#musicBtn').addEventListener('click',toggleMusic);
document.addEventListener('pointerdown',e=>{if(!musicOn && !e.target.closest('#musicBtn'))startMusic()},{once:true});

const accepted=['beautiful','pretty','love','cutie','adu','pakhi'];
$('#unlock').addEventListener('click',()=>{
  const v=$('#password').value.trim().toLowerCase();
  if(accepted.includes(v)){ $('#passwordError').textContent=''; go(2); }
  else $('#passwordError').textContent='Not quite. Try the name I always call you. ❤️';
});
$('#password').addEventListener('keydown',e=>{if(e.key==='Enter')$('#unlock').click()});

$('#blow').addEventListener('click',()=>{
  $('#cakeScene').classList.add('blown');
  $('#wishText').textContent='Wish made. I hope it comes true. ✨';
  $('#blow').disabled=true; $('#blow').textContent='Wish sent ♥';
  $('#afterWish').classList.remove('hidden');
});

function renderTerminal(){
  const out=$('#terminalOutput'); if(out.dataset.done)return;
  out.dataset.done='1';
  const lines=['booting boyfriend.exe…','checking loyalty.dll … OK','checking patience.sys … OK','checking “will hold her hand” module … OVERCLOCKED','checking future_plans.dat … FOUND','checking love.exe … RUNNING','FINAL STATUS: hopelessly in love ♥'];
  lines.forEach((x,i)=>setTimeout(()=>{const d=document.createElement('div');d.className='term-line '+(i>3?'ok':'');d.textContent='> '+x;out.appendChild(d)},i*420));
}
$('#runDiag').addEventListener('click',()=>{
  $('#terminalOutput').innerHTML='';
  delete $('#terminalOutput').dataset.done;
  renderTerminal();
});

const archiveCaptions=[
  'The girl behind all my favourite memories.',
  'One of those faces I could look at forever.',
  'Proof that you make ordinary photos feel special.',
  'My favourite kind of distraction.',
  'A little file marked: keep forever.',
  'The smile that keeps winning.',
  'Still my favourite person to photograph.',
  'Archive status: absolutely precious.',
  'Some pictures deserve their own little world.',
  'Final file: the one I never want to lose.'
];
let ai=0;
const archiveImg=$('#archiveImg');
function photoPath(n){return 'assets/photos/'+String(n).padStart(2,'0')+'.webp'}
function showArchive(){
  const frame=$('#archiveFrame');
  frame.style.transform='rotate(1.5deg) translateX(18px)';
  setTimeout(()=>{
    archiveImg.src=photoPath(ai+1);
    $('#archiveTag').textContent='FILE '+String(ai+1).padStart(2,'0');
    $('#archiveCaption').textContent=archiveCaptions[ai%archiveCaptions.length];
    $('#archiveProgress').style.width=((ai+1)/10*100)+'%';
    frame.style.transform='rotate(-1deg) translateX(0)';
  },120);
}
showArchive();
function archStep(d){ai=(ai+d+10)%10;showArchive()}
$('#archivePrev').onclick=()=>archStep(-1); $('#archiveNext').onclick=()=>archStep(1);
let touchX=null;
$('#archiveFrame').addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});
$('#archiveFrame').addEventListener('touchend',e=>{if(touchX==null)return;const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>40)archStep(dx<0?1:-1);touchX=null},{passive:true});

const museum=$('#museum');
const museumCaptions=['A day worth framing.','A memory I would replay.','Us, exactly as we are.','A tiny piece of our story.','The kind of moment I keep.','One more for the memory box.','Somewhere I want to return to.','Another reason I smile.','A moment that became ours.','Still one of my favourites.','This one feels like home.','A page from our little story.','The camera caught it. My heart kept it.','A memory with a heartbeat.','Just us being us.','One ordinary moment, made special.','A frame I never want to lose.','Another little treasure.','This belongs in the museum.','The archive keeps growing.'];
for(let i=1;i<=20;i++){
  const card=document.createElement('div');card.className='museum-card';
  card.innerHTML=`<img loading="lazy" src="${photoPath(i+10)}" alt="Our memory ${i}"><p>${museumCaptions[(i-1)%museumCaptions.length]}</p>`;
  museum.appendChild(card);
}

const qs=[
 ['Who is more likely to say “I’m not hungry” and then steal food?',['Adu','Me','Both of us','Obviously Adu']],
 ['What should happen on a random ordinary day?',['Stay home','Random food trip','Argue about nothing','All of the above']],
 ['Where is one of the someday destinations?',['Japan','The Moon','Anywhere with good food','Japan + anywhere together']]
];
let qi=0, answers=[];
function renderQuiz(){
  const q=$('#quiz');q.innerHTML='';
  qs.forEach((x,i)=>{
    const d=document.createElement('div');d.className='q-card';
    d.innerHTML=`<h3>${i+1}. ${x[0]}</h3><div class="answers">${x[1].map((a,j)=>`<button class="answer ${answers[i]===j?'selected':''}" data-q="${i}" data-a="${j}">${a}</button>`).join('')}</div>`;
    q.appendChild(d);
  });
  $$('.answer').forEach(b=>b.onclick=()=>{answers[+b.dataset.q]=+b.dataset.a;renderQuiz(); if(answers.length===qs.length)$('#quizFinish').classList.remove('hidden')});
}
renderQuiz();
$('#quizFinish').onclick=()=>{
  $('#quizResult').classList.remove('hidden');
  $('#quizResult').textContent='RESULT: 100% compatible. (The examiner may be biased, but the result stands.) ♥';
  $('#quizFinish').classList.add('hidden');
  setTimeout(()=>$('#quizResult').scrollIntoView({behavior:'smooth',block:'center'}),50);
};
$('#replay').onclick=()=>{page=0;pages.forEach(p=>p.classList.remove('active','leaving'));pages[0].classList.add('active');updateCounter();window.scrollTo(0,0)};

let wheelLock=false;
window.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<35 || wheelLock)return;
  wheelLock=true;go(page+(e.deltaY>0?1:-1));setTimeout(()=>wheelLock=false,900);
},{passive:true});
window.addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(page+1)}
  if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(page-1)}
});
let sx=null;
document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
document.addEventListener('touchend',e=>{
  if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;
  if(Math.abs(dx)>55 && !e.target.closest('#archiveFrame'))go(page+(dx<0?1:-1)); sx=null;
},{passive:true});
updateCounter();
