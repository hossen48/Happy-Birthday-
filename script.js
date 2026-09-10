const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const screens=$$('.screen');let idx=0,locked=false,musicOn=false;
function update(){screens.forEach((s,i)=>s.classList.toggle('active',i===idx));$('#counter').textContent=String(idx+1).padStart(2,'0')+' / '+String(screens.length).padStart(2,'0');$('#progress').style.width=((idx+1)/screens.length*100)+'%';if(idx===5)runTerminal();if(idx===8)buildQuiz();}
function go(d){if(locked)return;const n=Math.max(0,Math.min(screens.length-1,idx+d));if(n===idx)return;locked=true;screens[idx].classList.add('out');idx=n;update();setTimeout(()=>{screens.forEach(s=>s.classList.remove('out'));locked=false},950)}
function music(){const a=$('#bgm');a.volume=.36;let p=a.play();if(p?.catch)p.catch(()=>{});musicOn=true;$('#musicBtn').innerHTML='♫ <span>music on</span>'}
$('#musicBtn').onclick=()=>{const a=$('#bgm');if(a.paused)music();else{a.pause();musicOn=false;$('#musicBtn').innerHTML='♫ <span>music off</span>'}};
document.addEventListener('pointerdown',e=>{if(!musicOn&&!e.target.closest('#musicBtn'))music()},{once:true});

const allowed=['beautiful','pretty','love','cutie','adu','pakhi'];
$('#unlock').onclick=()=>{const v=$('#password').value.trim().toLowerCase();if(allowed.includes(v)){go(1);idx=2;update()}else $('#error').textContent='Try again, love. ♡'};
$('#password').onkeydown=e=>{if(e.key==='Enter')$('#unlock').click()};

$('#blow').onclick=()=>{$('#cake').classList.add('blown');$('#wish').textContent='Wish sent. I hope every part of it comes true. ✨';$('#blow').textContent='wish made ♡';$('#blow').disabled=true};

let termTimer;
function runTerminal(){clearTimeout(termTimer);const box=$('#termText');box.innerHTML='';const lines=['booting boyfriend.exe …','loyalty.dll .......... OK','patience.sys .......... OK','hand-holding module ... OVERCLOCKED','future_plans.dat ...... FOUND','love.exe .............. RUNNING','final diagnosis ....... hopelessly in love ♥'];lines.forEach((x,i)=>termTimer=setTimeout(()=>{const d=document.createElement('div');d.className='term '+(i>3?'ok':'');d.textContent='> '+x;box.appendChild(d)},i*350))}
$('#run').onclick=runTerminal;

const reasons=[
['The way you make ordinary moments feel special.','Somehow, even the smallest things become memories when they happen with you.'],
['Your smile. Obviously.','There are some expressions I could recognise from across a room. Yours is one of them.'],
['Your funny little faces.','You can make me laugh without even trying. That should probably be illegal.'],
['The way you care.','You notice little things. You remember things. You make people feel seen.'],
['How comfortable “us” feels.','Even silence feels different when it is shared with you.'],
['The way you make me want a future.','Not just exciting days — ordinary mornings, random food trips, a home.'],
['Your stubborn side.','Annoying? Sometimes. Adorable? Unfortunately, also yes.'],
['The memories we keep collecting.','Every photo is basically another tiny piece of a story I never want to finish.'],
['The way you feel like home.','Not a place. A person. The one I want beside me when the day gets quiet.'],
['Simply… you.','After all the reasons, explanations and evidence, it still comes down to you. ♡']
];
let ai=0,ax=0;const stage=$('#archiveStage'),img=$('#aimg');
function archiveRender(){img.src='assets/photos/'+String(ai+1).padStart(2,'0')+'.webp';$('#anum').textContent=String(ai+1).padStart(2,'0')+' / 10';$('#rnum').textContent=String(ai+1).padStart(2,'0');$('#reasonTitle').textContent=reasons[ai][0];$('#reasonText').textContent=reasons[ai][1];$('#dots').innerHTML=reasons.map((_,i)=>`<i class="${i===ai?'on':''}"></i>`).join('');$('.photo-card').classList.remove('shine');void $('.photo-card').offsetWidth;$('.photo-card').classList.add('shine')}
archiveRender();
function archiveStep(d){ai=(ai+d+10)%10;archiveRender()}
stage.addEventListener('touchstart',e=>ax=e.touches[0].clientX,{passive:true});
stage.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-ax;if(Math.abs(d)>45)archiveStep(d<0?1:-1)},{passive:true});
let wallBuilt=false;
function buildWall(){if(wallBuilt)return;wallBuilt=true;const w=$('#wall');for(let i=11;i<=30;i++){const d=document.createElement('div');d.className='memory';d.innerHTML=`<img loading="lazy" src="assets/photos/${String(i).padStart(2,'0')}.webp"><span>MEMORY ${String(i-10).padStart(2,'0')}</span>`;w.appendChild(d)}}
buildWall();

let quizBuilt=false,score=0;
const qdata=[
['Who is more likely to steal the other person’s food?',['Adu','Me','Both','The evidence says Adu']],
['What sounds most like us?',['A quiet ordinary day','A random food trip','A ridiculous argument','All of them']],
['What belongs in our “someday” list?',['Japan','A home','A life together','Yes.']]
];
function buildQuiz(){if(quizBuilt)return;quizBuilt=true;const q=$('#quiz');qdata.forEach((x,i)=>{const d=document.createElement('div');d.className='quiz-card';d.innerHTML=`<h3>${i+1}. ${x[0]}</h3>${x[1].map((a,j)=>`<button class="ans" data-i="${i}" data-j="${j}">${a}</button>`).join('')}`;q.appendChild(d)});$$('.ans').forEach(b=>b.onclick=()=>{const card=b.parentElement;card.querySelectorAll('.ans').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');card.dataset.done='1';if($$('.quiz-card').every(x=>x.dataset.done)){$('#quizResult').textContent='RESULT: 100% compatible. The examiner may be biased. The examiner does not care. ♥'}})}
let sx=null,sy=null;
document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*.75&&!e.target.closest('#archiveStage'))go(dx<0?1:-1);else if(Math.abs(dy)>70&&Math.abs(dy)>Math.abs(dx)&&e.target.closest('#quiz-page')){}sx=sy=null},{passive:true});
let wheel=false;window.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<40||wheel)return;wheel=true;go(e.deltaY>0?1:-1);setTimeout(()=>wheel=false,1000)},{passive:true});
window.addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown','PageDown'].includes(e.key))go(1);if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key))go(-1)});
update();
