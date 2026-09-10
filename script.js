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

// Birthday candles: layered flames extinguish, then animated smoke rises.
$('#blow').onclick=()=>{
  const cake=$('#cake'); if(cake.classList.contains('blown'))return;
  cake.classList.add('blown');
  $$('.candles b').forEach((c,i)=>setTimeout(()=>c.classList.add('extinguished'),i*150));
  $('#wish').textContent='The flames are out… smoke is carrying your wish up. ✨';
  $('#blow').textContent='wish sent ♡';$('#blow').disabled=true;
  setTimeout(()=>{$('#wish').textContent='Wish sent. I hope every part of it comes true. ♡'},1800);
};

let termTimer;
function runTerminal(){clearTimeout(termTimer);const box=$('#termText');box.innerHTML='';const lines=['booting boyfriend.exe …','loyalty.dll .......... OK','patience.sys .......... OK','hand-holding module ... OVERCLOCKED','future_plans.dat ...... FOUND','love.exe .............. RUNNING','final diagnosis ....... hopelessly in love ♥'];lines.forEach((x,i)=>termTimer=setTimeout(()=>{const d=document.createElement('div');d.className='term '+(i>3?'ok':'');d.textContent='> '+x;box.appendChild(d)},i*300))}
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
let ai=0,ax=0;const stage=$('#archiveStage'),img=$('#aimg'),photoCard=$('#photoCard');
function archiveRender(){img.src='assets/photos/'+String(ai+1).padStart(2,'0')+'.webp';$('#anum').textContent=String(ai+1).padStart(2,'0')+' / 10';$('#rnum').textContent=String(ai+1).padStart(2,'0');$('#reasonTitle').textContent=reasons[ai][0];$('#reasonText').textContent=reasons[ai][1];$('#dots').innerHTML=reasons.map((_,i)=>`<i class="${i===ai?'on':''}"></i>`).join('');photoCard.classList.remove('shine');void photoCard.offsetWidth;photoCard.classList.add('shine')}
function archiveStep(d){ai=(ai+d+10)%10;archiveRender()}
$('#archivePrev').onclick=()=>archiveStep(-1);$('#archiveNext').onclick=()=>archiveStep(1);
stage.addEventListener('touchstart',e=>ax=e.touches[0].clientX,{passive:true});
stage.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-ax;if(Math.abs(d)>45)archiveStep(d<0?1:-1)},{passive:true});
archiveRender();

let wallBuilt=false;function buildWall(){if(wallBuilt)return;wallBuilt=true;const w=$('#wall');for(let i=11;i<=30;i++){const d=document.createElement('div');d.className='memory';d.innerHTML=`<img loading="lazy" src="assets/photos/${String(i).padStart(2,'0')}.webp"><span>MEMORY ${String(i-10).padStart(2,'0')}</span>`;w.appendChild(d)}}buildWall();

// Detective Adu mini mystery.
const clueText={
  1:'CLUE 01 — Witness report: every time she smiles, the victim forgets what he was saying. Suspiciously powerful.',
  2:'CLUE 02 — Food evidence: repeated incidents of stolen bites. The victim keeps smiling anyway. Motive: affection disguised as snacks.',
  3:'CLUE 03 — Future file: Japan, a home, little adventures, and a life together all appear in the same folder. Someone has been planning ahead.',
  4:'CLUE 04 — Final message recovered: “If you ever forget how loved you are… come back to this little website.” Case solved. The heart was never missing.'
};
let detectiveSuspect='';let cluesOpened=0;
$$('.suspect').forEach(b=>b.onclick=()=>{
  detectiveSuspect=b.dataset.suspect;
  $$('.suspect').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');
  $('#detectiveHint').textContent=detectiveSuspect==='adu'?'Strong lead. Detective Adu appears to know suspiciously much about the evidence.':'Interesting theory. Now unlock the evidence and test it.';
  $$('.clue').forEach(c=>c.classList.remove('locked-clue'));
  $('#evidencePaper').textContent='Evidence unlocked. Inspect all four clues.';
});
$$('.clue').forEach(c=>c.onclick=()=>{
  if(!detectiveSuspect){$('#evidencePaper').textContent='You need a suspect first, Detective. Tap one above.';return}
  const n=Number(c.dataset.clue);c.classList.add('read');$('#evidencePaper').textContent=clueText[n];
  cluesOpened=new Set($$('.clue.read').map(x=>x.dataset.clue)).size;$('#clueCount').textContent=cluesOpened+' / 4';
  if(cluesOpened===4){$('#detectiveResult').innerHTML='<span>CASE CLOSED</span><strong>Detective Adu solved it.</strong><p>The thief was Adu — not because she took his heart, but because he willingly handed it over. ♡</p>';$('#detectiveResult').classList.add('show')}
});

// One-question-per-page compatibility test.
const qdata=[
 ['Who is more likely to steal the other person’s food?',['Adu','Me','Both','The evidence says Adu'],0],
 ['What sounds most like our perfect ordinary day?',['A random food trip','Staying home together','A long adventure','All of them'],3],
 ['Where do I still want us to go together?',['Japan','The moon','The grocery store only','Somewhere with good food'],0],
 ['What kind of future do I want with you?',['Big and flashy','Quiet and ours','Always travelling','I have no idea'],1],
 ['What happens to our arguments most often?',['They become funny later','They become documentaries','Nobody remembers','We call the police'],0],
 ['What do I want more of with you?',['Ordinary days','Hand-holding','Little adventures','All of these'],3],
 ['Which one is most “us”?',['Cooking together','Funny faces','Random conversations','All of these'],3],
 ['What does “home” mean to me?',['A place','A person','A building','A Wi‑Fi password'],1],
 ['How long have we known each other?',['Since 2012','Since yesterday','Since 2026','Since the dinosaurs'],0],
 ['Final question: who do I choose?',['You','Still you','Obviously you','All answers are correct'],3]
];
let quizIndex=0,answers=Array(qdata.length).fill(null);
function renderQuiz(){
 const q=qdata[quizIndex];$('#quizCount').textContent=String(quizIndex+1).padStart(2,'0')+' / '+String(qdata.length).padStart(2,'0');$('#quizProgress').style.width=((quizIndex+1)/qdata.length*100)+'%';
 $('#quiz').innerHTML=`<article class="quiz-card"><div class="question-tag">QUESTION ${String(quizIndex+1).padStart(2,'0')}</div><h3>${q[0]}</h3><div class="answers">${q[1].map((a,j)=>`<button class="ans ${answers[quizIndex]===j?'sel':''}" data-j="${j}"><span>${String.fromCharCode(65+j)}</span>${a}</button>`).join('')}</div></article>`;
 $$('.ans').forEach(b=>b.onclick=()=>{answers[quizIndex]=Number(b.dataset.j);renderQuiz();});
 $('#quizPrev').disabled=quizIndex===0;$('#quizNext').textContent=quizIndex===qdata.length-1?'see result ♡':'next →';
 $('#quizResult').textContent='';
}
$('#quizPrev').onclick=()=>{if(quizIndex>0){quizIndex--;renderQuiz()}};
$('#quizNext').onclick=()=>{if(answers[quizIndex]===null){$('#quizResult').textContent='Choose one, detective. I mean… birthday girl. ♡';return}if(quizIndex<qdata.length-1){quizIndex++;renderQuiz();return}let score=answers.reduce((n,a,i)=>n+(a===qdata[i][3]?1:0),0);$('#quizResult').innerHTML=`<strong>${score}/${qdata.length}</strong> — compatible enough to be suspicious. And honestly, I was going to love you either way. ♥`;};

update();
