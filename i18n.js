(function(){
  const langs={en:'English',de:'Deutsch',fr:'Français',it:'Italiano',es:'Español'};
  const langToIndex={de:0,fr:1,it:2,es:3};
  const dict=window.MARATABLE_TRANSLATIONS||{};
  const path=location.pathname.split('/').pop()||'index.html';
  const defaultLanguage='en';
  let language='en';
  try{language=localStorage.getItem('maratable-language')||'en'}catch(e){}
  if(!langs[language])language='en';
  function translateTextNodes(lang){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&!['SCRIPT','STYLE','NOSCRIPT'].includes(n.parentElement.tagName)&&n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    let node;
    while(node=walker.nextNode()){
      if(node.__mtOriginal===undefined)node.__mtOriginal=node.nodeValue;
      const original=node.__mtOriginal; const trimmed=original.trim();
      const entry=dict[trimmed];
      const value=lang==='en'?trimmed:(entry?entry[langToIndex[lang]]:trimmed);
      node.nodeValue=original.replace(trimmed,value||trimmed);
    }
  }
  function translateAttributes(lang){
    const attrNames=['placeholder','aria-label','title','alt'];
    document.querySelectorAll('*').forEach(el=>attrNames.forEach(attr=>{
      if(!el.hasAttribute(attr))return;
      const key='mtOriginal'+attr[0].toUpperCase()+attr.slice(1);
      if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);
      const original=el.dataset[key];const entry=dict[original];
      el.setAttribute(attr,lang==='en'?original:(entry?entry[langToIndex[lang]]||original:original));
    }));
    const title=document.querySelector('title');
    if(title){if(!title.dataset.mtOriginal)title.dataset.mtOriginal=title.textContent;const t=title.dataset.mtOriginal;const entry=dict[t];title.textContent=lang==='en'?t:(entry?entry[langToIndex[lang]]||t:t)}
    const meta=document.querySelector('meta[name="description"]');
    if(meta){if(!meta.dataset.mtOriginal)meta.dataset.mtOriginal=meta.content;const t=meta.dataset.mtOriginal;const entry=dict[t];meta.content=lang==='en'?t:(entry?entry[langToIndex[lang]]||t:t)}
  }
  function applyLanguage(lang){if(!langs[lang])return;language=lang;document.documentElement.lang=lang;translateTextNodes(lang);translateAttributes(lang);try{localStorage.setItem('maratable-language',lang)}catch(e){};document.querySelectorAll('[data-language-select]').forEach(s=>s.value=lang);document.dispatchEvent(new CustomEvent('maratable:language-changed',{detail:{language:lang}}))}
  function addSelector(){
    const nav=document.querySelector('.nav-inner');if(!nav||nav.querySelector('[data-language-select]'))return;
    const select=document.createElement('select');select.className='language-select';select.setAttribute('data-language-select','');select.setAttribute('aria-label','Website language');
    Object.entries(langs).forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=code.toUpperCase()+' · '+name;select.appendChild(o)});
    select.value=language;select.addEventListener('change',()=>applyLanguage(select.value));
    const cta=nav.querySelector('.nav-cta');if(cta)nav.insertBefore(select,cta);else nav.appendChild(select);
  }
  document.addEventListener('DOMContentLoaded',()=>{addSelector();applyLanguage(language)});
})();
