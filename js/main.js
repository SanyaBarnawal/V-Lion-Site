/* ===== CONFIG =====
   Paste your Telegram relay URL (see worker/telegram-relay.js and README) between the quotes.
   Leave empty to run the form in demo mode. */
const ENDPOINT='';

const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)};
/* nav shadow */
addEventListener('scroll',()=>$('#nav').classList.toggle('s',scrollY>20),{passive:true});
/* images */
const co=$('.coach');addEventListener('scroll',()=>{co.style.setProperty('--py',(-co.getBoundingClientRect().top*.08)+'px')},{passive:true});
const cp=$('.cph');cp.addEventListener('pointermove',e=>{const r=cp.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5;$('.cimg').style.transform=`translateX(${x*14}px)`});cp.addEventListener('pointerleave',()=>$('.cimg').style.transform='');
/* roar */
const lb=$('#lionbox');
const roar=()=>{lb.classList.remove('roar');void lb.offsetWidth;lb.classList.add('roar');if(navigator.vibrate&&navigator.userActivation&&navigator.userActivation.hasBeenActive)navigator.vibrate(80)};
lb.onclick=roar;lb.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();roar()}};
setTimeout(roar,1600);
/* tilt lion with pointer */
lb.addEventListener('pointermove',e=>{const r=lb.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('.lion',lb).style.transform=`translate(${x*24}px,${y*24}px) rotate(${x*10}deg)`});
lb.addEventListener('pointerleave',()=>$('.lion',lb).style.transform='');
/* ripple on buttons */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn');if(!b)return;const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),i=document.createElement('i');i.className='rip';i.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.appendChild(i);setTimeout(()=>i.remove(),600)});
/* products + cart */
const P=[['🥛','Whey Isolate','Chocolate, 1 kg · 25 g protein per scoop','₹2,499','Best seller'],['🌱','Plant Protein','Pea + rice blend, 1 kg · dairy free','₹2,199','Vegan'],['⚡','Creatine Mono','250 g · 83 servings, unflavoured','₹899','Strength'],['🍌','Mass Gainer','3 kg · 600 kcal per serving','₹2,999','Bulk'],['💊','Daily Multi','60 tablets · vitamins and minerals','₹699','Health'],['🔋','Pre-Workout','Berry, 300 g · caffeine 200 mg','₹1,299','Energy']];
$('#products').innerHTML=P.map((p,i)=>`<div class="card rv"><span class="tub">${p[0]}</span><span class="tag">${p[4]}</span><h3>${p[1]}</h3><p>${p[2]}</p><div class="price">${p[3]}</div><button class="btn" data-i="${i}">Add to cart</button></div>`).join('');
let n=0;
$('#products').addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(!b)return;
 const src=b.closest('.card').querySelector('.tub').getBoundingClientRect(),dst=$('#cartbtn').getBoundingClientRect(),f=document.createElement('div');
 f.className='fly';f.textContent=P[b.dataset.i][0];f.style.left=src.left+'px';f.style.top=src.top+'px';document.body.appendChild(f);
 requestAnimationFrame(()=>{f.style.transform=`translate(${dst.left-src.left}px,${dst.top-src.top}px) scale(.3)`;f.style.opacity='.4'});
 setTimeout(()=>{f.remove();n++;$('#cnt').textContent=n;const c=$('#cartbtn');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')},700);
 b.textContent='Added ✓';setTimeout(()=>b.textContent='Add to cart',1400);toast(P[b.dataset.i][1]+' added to cart')});
$('#cartbtn').onclick=()=>toast(n?`${n} item${n>1?'s':''} in your cart. Checkout opens soon.`:'Your cart is empty.');
/* diet tabs */
const D={'Build muscle':[2800,['Breakfast','4 eggs, oats, banana','650 kcal'],['Lunch','Chicken, rice, dal, salad','800 kcal'],['Snack','Whey shake, peanut butter toast','500 kcal'],['Dinner','Paneer or fish, roti, vegetables','850 kcal']],
'Lose fat':[1800,['Breakfast','Egg whites, oats, berries','350 kcal'],['Lunch','Grilled chicken, quinoa, greens','500 kcal'],['Snack','Whey shake, apple','250 kcal'],['Dinner','Fish or tofu, sautéed vegetables','450 kcal']],
'Vegetarian':[2200,['Breakfast','Moong chilla, curd','450 kcal'],['Lunch','Rajma, rice, salad','650 kcal'],['Snack','Plant protein shake, nuts','400 kcal'],['Dinner','Paneer bhurji, roti, vegetables','600 kcal']]};
const tabs=$('#tabs'),panels=$('#panels');
Object.keys(D).forEach((k,i)=>{tabs.insertAdjacentHTML('beforeend',`<button class="tab" role="tab" aria-selected="${!i}" data-k="${k}">${k}</button>`);
 panels.insertAdjacentHTML('beforeend',`<div class="panel ${i?'':'on'}" role="tabpanel" data-k="${k}"><h3 style="font-size:2.4rem">${D[k][0].toLocaleString('en-IN')} kcal a day</h3>${D[k].slice(1).map(m=>`<div class="meal"><span><b>${m[0]}</b><br>${m[1]}</span><span>${m[2]}</span></div>`).join('')}<div class="bar"><i data-w="${Math.min(100,D[k][0]/32)}"></i></div></div>`)});
const fill=()=>setTimeout(()=>{const i=$('.panel.on .bar i');i.style.width='0';requestAnimationFrame(()=>i.style.width=i.dataset.w+'%')},50);
tabs.onclick=e=>{const t=e.target.closest('.tab');if(!t)return;$$('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));$$('.panel').forEach(p=>p.classList.toggle('on',p.dataset.k===t.dataset.k));fill()};
/* form */
const notify=async d=>{if(!ENDPOINT)return true;try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});return r.ok}catch(_){return false}};
$('#form').onsubmit=async e=>{e.preventDefault();const m=$('#msg'),nm=$('#nm').value.trim(),ph=$('#ph').value.trim(),gl=$('#gl').value;
 if(!nm||ph.replace(/\D/g,'').length<10){m.textContent='Enter your name and a 10-digit phone number.';return}
 m.textContent='Sending...';
 if(!await notify({type:'contact',name:nm,phone:ph,goal:gl})){m.textContent='Could not send. Please try again or call us.';return}
 m.textContent=`Thanks ${nm}. Kisshor will call you soon. 🦁`;roar();e.target.reset()};
/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;en.target.classList.add('in');io.unobserve(en.target);
 $$('[data-n]',en.target).forEach(c=>{const t=+c.dataset.n,s=performance.now();(function step(now){const p=Math.min((now-s)/1400,1);c.textContent=Math.round(t*(1-Math.pow(1-p,3)))+(t>100?'+':'');if(p<1)requestAnimationFrame(step)})(s)});
 if(en.target.id==='panels')fill()}),{threshold:.2});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
