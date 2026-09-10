const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const screens=$$('.screen');let idx=0,locked=false,musicOn=false;

function update(){
  screens.forEach((s,i)=>s.classList.toggle('active',i===idx));
  $('#counter').textContent=String(idx+1).padStart(2,'0')+' / '+String(screens.length).padStart(2,'0');
  $('#progress').style.width=((idx+1)/screens.length*100)+'%';
  $('#prevPage').disabled=idx===0;
  $('#nextPage').disabled=idx===screens.length-1;
  $('#navDots').innerHTML=screens.map((_,i)=>`<i class="${i===idx?'on':''}"></i>`).join('');
  if(idx===5)runTerminal();
  if(idx===10)renderQuiz();
}
function go(d){if(locked)return;const n=Math.max(0,Math.min(screens.length-1,idx+d));if(n===idx)return;locked=true;screens[idx].classList.add('out');idx=n;update();setTimeout(()=>{screens.forEach(s=>s.classList.remove('out'));locked=false},760)}
$('#prevPage').onclick=()=>go(-1);$('#nextPage').onclick=()=>go(1);

function music(){const a=$('#bgm');a.volume=.36;const p=a.play();if(p?.catch)p.catch(()=>{});musicOn=true;$('#musicBtn').innerHTML='♫ <span>music on</span>'}
$('#musicBtn').onclick=()=>{const a=$('#bgm');if(a.paused)music();else{a.pause();musicOn=false;$('#musicBtn').innerHTML='♫ <span>music off</span>'}};
document.addEventListener('pointerdown',e=>{if(!musicOn&&!e.target.closest('#musicBtn'))music()},{once:true});

const allowed=['beautiful','pretty','love','cutie','adu','pakhi'];
$('#unlock').onclick=()=>{const v=$('#password').value.trim().toLowerCase();if(allowed.includes(v)){ $('#error').textContent='';idx=2;update(); }else $('#error').textContent='Try again, love. ♡'};
$('#password').onkeydown=e=>{if(e.key==='Enter')$('#unlock').click()};

// Birthday candles: a staged blow-out with flame distortion, glow collapse and smoke.
$('#blow').onclick=()=>{
 const cake=$('#cake'); if(cake.classList.contains('blown'))return;
 cake.classList.add('blown');
 const candles=$$('.candles b');
 $('#wish').textContent='The flame is fighting back… blow again. ✨';
 candles.forEach((c,i)=>{setTimeout(()=>{c.classList.add('extinguished')},i*220)});
 setTimeout(()=>{$('#wish').textContent='The candles are out… look at the smoke carrying your wish. ♡'},900);
 setTimeout(()=>{$('#wish').textContent='Wish sent. I hope every part of it comes true. ✨'},2700);
 $('#blow').textContent='wish sent ♡';$('#blow').disabled=true;
};


let termTimer;
function runTerminal(){clearTimeout(termTimer);const box=$('#termText');box.innerHTML='';const lines=['booting boyfriend.exe …','loyalty.dll .......... OK','patience.sys .......... OK','hand-holding module ... OVERCLOCKED','future_plans.dat ...... FOUND','love.exe .............. RUNNING','final diagnosis ....... hopelessly in love ♥'];lines.forEach((x,i)=>termTimer=setTimeout(()=>{const d=document.createElement('div');d.className='term '+(i>3?'ok':'');d.textContent='> '+x;box.appendChild(d)},i*300))}
$('#run').onclick=runTerminal;

const reasons=[
 ['You became my best friend before you became my girlfriend.','Maybe that is why loving you feels so natural. I never had to pretend around you.'],
 ['You care in the little ways.','Your time, your attention, and the way you show up mean more to me than the big dramatic things ever could.'],
 ['You hold my hand when I need it.','There is something about your hand in mine that makes even a difficult moment feel quieter.'],
 ['You forgive me when I don’t deserve it.','I know I am not perfect. I notice your patience, and I never want to take it for granted.'],
 ['Your funny faces.','You can turn an ordinary moment into something I will remember just because you decided to be you.'],
 ['Your cooking.','I love the simple, everyday version of us — making food, eating together, and somehow making it feel special.'],
 ['Even our stupid arguments become memories.','We can be annoyed, laugh later, and somehow find our way back to each other. That matters to me.'],
 ['I love the ordinary days I get with you.','Random food trips, boring Tuesdays, plans changing halfway through — I want those days too.'],
 ['You make me want a future, not just a moment.','A home. Two little kids. Little adventures. Japan. A life that keeps choosing us.'],
 ['I simply love you, Adu.','After all the details, it still comes down to the person I want beside me — again and again. ♡']
];
let ai=0,ax=0;const stage=$('#archiveStage'),img=$('#aimg'),photoCard=$('#photoCard');
function archiveRender(){img.src='assets/photos/'+String(ai+1).padStart(2,'0')+'.webp';$('#anum').textContent=String(ai+1).padStart(2,'0')+' / 10';$('#rnum').textContent=String(ai+1).padStart(2,'0');$('#reasonTitle').textContent=reasons[ai][0];$('#reasonText').textContent=reasons[ai][1];$('#dots').innerHTML=reasons.map((_,i)=>`<i class="${i===ai?'on':''}"></i>`).join('');photoCard.classList.remove('shine');void photoCard.offsetWidth;photoCard.classList.add('shine')}
function archiveStep(d){ai=(ai+d+10)%10;archiveRender()}
$('#archivePrev').onclick=()=>archiveStep(-1);$('#archiveNext').onclick=()=>archiveStep(1);
stage.addEventListener('touchstart',e=>ax=e.touches[0].clientX,{passive:true});
stage.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-ax;if(Math.abs(d)>45)archiveStep(d<0?1:-1)},{passive:true});
archiveRender();

let wallBuilt=false;function buildWall(){if(wallBuilt)return;wallBuilt=true;const w=$('#wall');for(let i=11;i<=30;i++){const d=document.createElement('div');d.className='memory';d.innerHTML=`<img loading="lazy" src="assets/photos/${String(i).padStart(2,'0')}.webp"><span>MEMORY ${String(i-10).padStart(2,'0')}</span>`;w.appendChild(d)}}buildWall();

// Detective Adu — interactive interrogation mystery.
const detectiveCases=[
 {q:'What was the first clue that the heart thief was already close?',a:['A random food trip','She was already his best friend','A suspicious Wi‑Fi signal','Japan sent a postcard'],ok:1,e:'EVIDENCE 01 — The suspect was not a stranger. She was the best friend first. The heart was already in the wrong hands.'},
 {q:'What does the victim keep asking for?',a:['More ordinary days together','A new phone','A detective badge','A lifetime supply of fries'],ok:0,e:'EVIDENCE 02 — The victim keeps asking for ordinary days: food trips, funny faces, cooking, arguments that become funny, and her hand in his.'},
 {q:'Which future file was found on the victim’s desk?',a:['A solo world tour','Japan + a home + two little kids','A career in detective work','A secret pizza franchise'],ok:1,e:'EVIDENCE 03 — The future file contains Japan, a home, two little kids, and a happy life together. The suspect has clearly been invited into the future.'},
 {q:'Final interrogation: did she steal the heart?',a:['Yes — absolutely','No — he willingly gave it to her','The food stole it','The heart escaped to Japan'],ok:1,e:'FINAL EVIDENCE — Case solved. She did not steal the heart. Hossen handed it over willingly, and has no intention of asking for it back. ♡'}
];
let detectiveStep=0, detectiveScore=0;
function detectiveRender(){
 const q=detectiveCases[detectiveStep];
 $('#clueCount').textContent=String(detectiveStep).padStart(2,'0')+' / 04';
 $('#detectiveQuestion').textContent=q.q;
 $('#detectiveChoices').innerHTML=q.a.map((a,i)=>`<button class="detective-answer" data-i="${i}">${String.fromCharCode(65+i)} · ${a}</button>`).join('');
 $('#detectiveHint').textContent='Pick the answer you think Detective Adu would circle in red ink.';
 $('#evidenceMeter').style.width=(detectiveStep/4*100)+'%';
 $$('#detectiveChoices .detective-answer').forEach(b=>b.onclick=()=>detectiveAnswer(Number(b.dataset.i)));
}
function detectiveAnswer(choice){
 const q=detectiveCases[detectiveStep], buttons=$$('#detectiveChoices .detective-answer');
 buttons.forEach(b=>b.disabled=true);
 const chosen=buttons[choice];
 if(choice===q.ok){detectiveScore++;chosen.classList.add('correct');$('#detectiveHint').textContent='Correct. Evidence unlocked. 🔎';}
 else{chosen.classList.add('wrong');buttons[q.ok].classList.add('correct');$('#detectiveHint').textContent='Close… but the evidence points elsewhere. Read the file.';}
 $('#evidencePaper').innerHTML=`<div class="evidence-lock">${choice===q.ok?'🔓':'📎'}</div><b>${q.e}</b><p>Evidence ${detectiveStep+1} of 4 recovered.</p>`;
 $('#evidenceMeter').style.width=((detectiveStep+1)/4*100)+'%';
 setTimeout(()=>{
  detectiveStep++;
  if(detectiveStep<detectiveCases.length){detectiveRender();}
  else{
   $('#detectiveQuestion').innerHTML='CASE CLOSED <span class="final-heart">♡</span>';
   $('#detectiveChoices').innerHTML='';
   $('#detectiveHint').textContent=`Detective Adu scored ${detectiveScore}/4. The answer was always hiding in plain sight.`;
   $('#evidencePaper').innerHTML='<div class="evidence-lock">💗</div><b>THE HEART HAS BEEN RECOVERED.</b><p>Official conclusion: Adu is guilty of being the person Hossen wants beside him for the ordinary days too.</p>';
   $('#detectiveResult').innerHTML='<span>CASE CLOSED</span><strong>Verdict: hopelessly in love.</strong><p>Detective Adu solved the case. Unfortunately, the evidence proves the heart is staying with her.</p>';
   $('#detectiveResult').classList.add('show');
  }
 },850);
}
$$('.suspect').forEach(b=>b.onclick=()=>{
 $$('.suspect').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');
 $('#detectiveHint').textContent=b.dataset.suspect==='adu'?'Interesting. The prime suspect has been selected. Now interrogate the evidence.':'Interesting theory. Interrogation will tell us whether you are right.';
});
detectiveRender();

// One-question-per-page compatibility test — every question comes from details of Hossen + Adu's story.
const qdata=[
 ['How long have Hossen and Adu known each other?',['Since 2012','Since 2024','Since 24 January 2026','Since yesterday'],0],
 ['What happened on 24 January 2026?',['A random food trip','The relationship became official','We went to Japan','The website was launched'],1],
 ['Which kind of date fits us best?',['A random food trip','A formal business dinner','A silent train ride','A meeting with the detective'],0],
 ['What does Hossen want on the ordinary days?',['Only exciting adventures','Random food trips, cooking, funny faces and her hand in his','To stay busy all day','Nothing ordinary'],1],
 ['When we have a stupid argument, what does Hossen hope happens later?',['It becomes a funny memory','The police get involved','We forget each other','We move to another country'],0],
 ['What does Hossen still want to do with Adu?',['Go to Japan together','Never travel again','Open a detective agency','Live only in airports'],0],
 ['What kind of future does Hossen imagine?',['A home, two little kids and a happy life together','A life with no plans','A world tour with strangers','A house full of detectives'],0],
 ['What was Adu before she became Hossen’s girlfriend?',['His best friend','His neighbour','His teacher','His detective partner'],0],
 ['What simple thing does Hossen specifically love?',['Her hand in his','Her alarm clock','Her Wi‑Fi password','Her shoe collection'],0],
 ['What does Hossen say about Adu forgiving him?',['She forgives him when he doesn’t deserve it','She never forgives him','She makes him write reports','She sends him to Japan'],0],
 ['What does Hossen want to keep choosing?',['Each other','Different people every year','Only adventures','The same restaurant forever'],0],
 ['Final question: after everything, who does Hossen choose again and again?',['Adu','Japan','The food thief','The detective'],0]
];
let quizIndex=0,answers=Array(qdata.length).fill(null),quizFinished=false;
function renderQuiz(){
 if(quizFinished)return;
 const q=qdata[quizIndex];$('#quizCount').textContent=String(quizIndex+1).padStart(2,'0')+' / '+String(qdata.length).padStart(2,'0');$('#quizProgress').style.width=((quizIndex+1)/qdata.length*100)+'%';
 $('#quiz').innerHTML=`<article class="quiz-card"><div class="question-tag">QUESTION ${String(quizIndex+1).padStart(2,'0')}</div><h3>${q[0]}</h3><div class="answers">${q[1].map((a,j)=>`<button class="ans ${answers[quizIndex]===j?'sel':''}" data-j="${j}"><span>${String.fromCharCode(65+j)}</span>${a}</button>`).join('')}</div></article>`;
 $$('.ans').forEach(b=>b.onclick=()=>{answers[quizIndex]=Number(b.dataset.j);renderQuiz()});
 $('#quizPrev').disabled=quizIndex===0;$('#quizNext').textContent=quizIndex===qdata.length-1?'see result ♡':'next →';$('#quizResult').textContent='';
}
$('#quizPrev').onclick=()=>{if(quizIndex>0){quizIndex--;renderQuiz()}};
$('#quizNext').onclick=()=>{
 if(answers[quizIndex]===null){$('#quizResult').textContent='Choose one, birthday girl. ♡';return}
 if(quizIndex<qdata.length-1){quizIndex++;renderQuiz();return}
 const score=answers.reduce((n,a,i)=>n+(a===qdata[i][2]?1:0),0);quizFinished=true;
 $('#quiz').innerHTML=`<div class="quiz-finished"><div class="question-tag">COMPATIBILITY REPORT</div><h3>${score}/${qdata.length}</h3><p>${score===qdata.length?'Perfect score. Either you know us ridiculously well, or you have been paying very close attention. ♡':'A very respectable score. The important part is that every answer still leads back to us. ♥'}</p></div>`;
 $('#quizCount').textContent='DONE';$('#quizNext').textContent='finished ♡';$('#quizNext').disabled=true;$('#quizResult').textContent='The science department has officially approved Hossen × Adu.';
};

// Envelope opening: the exact letter appears only after the seal is opened.
function openLetter(){
 const env=$('#letterEnvelope'),paper=$('#actualLetter'),hint=$('.envelope-hint');
 if(env.classList.contains('open'))return;
 env.classList.add('open');
 hint.innerHTML='Seal opened. <b>Your letter is waiting…</b>';
 setTimeout(()=>{paper.classList.add('revealed');paper.scrollIntoView({behavior:'smooth',block:'start'});hint.innerHTML='♡ Read it slowly. It was written only for you.'},850);
}
$('#letterEnvelope').onclick=openLetter;$('#letterEnvelope').onkeydown=e=>{if(e.key==='Enter'||e.key===' ')openLetter()};

// Restart absolutely everything without refreshing the browser.
$('#restartBtn').onclick=()=>{
 idx=0;locked=false;update();
 ai=0;archiveRender();
 quizIndex=0;answers=Array(qdata.length).fill(null);quizFinished=false;renderQuiz();
 detectiveStep=0;detectiveScore=0;$('#detectiveResult').classList.remove('show');$('#evidenceMeter').style.width='0%';$('#evidencePaper').innerHTML='<div class="evidence-lock">🔒</div><b>Evidence is encrypted.</b><p>Get through the interrogation to unlock the file.</p>';detectiveRender();
 const cake=$('#cake');cake.classList.remove('blown');$$('.candles b').forEach(c=>c.classList.remove('extinguished'));$('#blow').disabled=false;$('#blow').textContent='blow the candles ✨';$('#wish').textContent='Take a breath… then make your wish.';
 const env=$('#letterEnvelope'),paper=$('#actualLetter');env.classList.remove('open');paper.classList.remove('revealed');paper.scrollTop=0;document.querySelector('.letter-screen').scrollTop=0;
};

update();
