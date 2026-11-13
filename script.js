(function(){
  const menu=document.querySelector('[data-menu]');
  const drawer=document.querySelector('.drawer');
  if(menu&&drawer){
    const closeMenu=()=>{drawer.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');};
    menu.addEventListener('click',()=>{
      const isOpen=drawer.classList.toggle('open');
      menu.setAttribute('aria-expanded',isOpen?'true':'false');
      menu.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
    });
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  }

  const stage=document.querySelector('[data-hero-carousel]');
  if(stage){
    const cards=[...stage.querySelectorAll('.hero-card')];
    const dots=[...stage.querySelectorAll('.hero-dots button')];
    let active=0;
    let timer=null;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const positions={
      desktop:[
        {x:0,y:0,r:0,s:1.02,z:8},
        {x:174,y:24,r:8,s:.82,z:7},
        {x:-142,y:112,r:-7,s:.78,z:6},
        {x:-170,y:-72,r:6,s:.72,z:5}
      ],
      mobile:[
        {x:0,y:0,r:0,s:.98,z:8},
        {x:92,y:18,r:7,s:.77,z:7},
        {x:-74,y:84,r:-6,s:.74,z:6},
        {x:-82,y:-48,r:5,s:.68,z:5}
      ]
    };
    function render(){
      const mobile=window.innerWidth<=560;
      const layout=mobile?positions.mobile:positions.desktop;
      cards.forEach((card,index)=>{
        const relative=(index-active+cards.length)%cards.length;
        const pos=layout[relative];
        card.style.transform=`translate(${pos.x}px,${pos.y}px) rotate(${pos.r}deg) scale(${pos.s})`;
        card.style.zIndex=String(pos.z);
        card.style.opacity=relative===0?'1':'.92';
        card.classList.toggle('is-active',relative===0);
        card.setAttribute('aria-hidden',relative===0?'false':'true');
      });
      dots.forEach((dot,index)=>{
        const selected=index===active;
        dot.classList.toggle('active',selected);
        dot.setAttribute('aria-pressed',selected?'true':'false');
      });
    }
    function stop(){if(timer){window.clearInterval(timer);timer=null;}}
    function start(){
      stop();
      if(!reduceMotion && !document.hidden) timer=window.setInterval(()=>{active=(active+1)%cards.length;render();},5200);
    }
    dots.forEach((dot,index)=>dot.addEventListener('click',()=>{active=index;render();start();}));
    stage.addEventListener('mouseenter',stop);
    stage.addEventListener('mouseleave',start);
    stage.addEventListener('focusin',stop);
    stage.addEventListener('focusout',start);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
    window.addEventListener('resize',render,{passive:true});
    render();start();
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
