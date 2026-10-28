(function(){
  const menu=document.querySelector('[data-menu]');
  const drawer=document.querySelector('.drawer');
  if(menu&&drawer){menu.addEventListener('click',()=>drawer.classList.toggle('open'));drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')))}

  const stage=document.querySelector('[data-hero-carousel]');
  if(stage){
    const cards=[...stage.querySelectorAll('.hero-card')];
    const dots=[...stage.querySelectorAll('.hero-dots button')];
    let active=0;
    const desktop=[
      {x:0,y:-108,r:1,s:1.03,z:5},
      {x:172,y:28,r:8,s:.92,z:4},
      {x:28,y:164,r:3,s:.84,z:2},
      {x:-165,y:105,r:-8,s:.89,z:3}
    ];
    const mobile=[
      {x:0,y:-60,r:0,s:.98,z:5},
      {x:88,y:22,r:6,s:.84,z:4},
      {x:10,y:96,r:3,s:.74,z:2},
      {x:-86,y:62,r:-6,s:.86,z:3}
    ];
    function render(){
      const m=window.innerWidth<=560?mobile:window.innerWidth<=820?desktop.map((p,i)=>({...p,x:p.x*.72,y:p.y*.78,s:p.s*.94})):desktop;
      cards.forEach((c,i)=>{
        const rel=(i-active+cards.length)%cards.length;
        const p=m[rel];
        c.style.transform=`translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${p.s})`;
        c.style.zIndex=p.z; c.style.opacity=rel===0?'1':'.88';
        c.style.filter=rel===0?'brightness(1.08) saturate(1.08)':'brightness(.88) saturate(.9)';
      });
      dots.forEach((d,i)=>d.classList.toggle('active',i===active));
    }
    dots.forEach((d,i)=>d.addEventListener('click',()=>{active=i;render()}));
    let timer=setInterval(()=>{active=(active+1)%cards.length;render()},5200);
    stage.addEventListener('mouseenter',()=>clearInterval(timer));
    stage.addEventListener('mouseleave',()=>{clearInterval(timer);timer=setInterval(()=>{active=(active+1)%cards.length;render()},5200)});
    window.addEventListener('resize',render); render();
  }

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();

(function(){
  const file=location.pathname.split('/').pop()||'index.html';
  const map={
    'index.html':'home','company.html':'about','products.html':'products','resources.html':'quality','responsibility.html':'responsibility','export.html':'supply','investors.html':'investors','suppliers.html':'suppliers'
  };
  document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===map[file]));
})();
