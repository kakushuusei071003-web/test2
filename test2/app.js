(() => {
  'use strict';
  const app=document.getElementById('app'),toast=document.getElementById('toast');
  const state={page:'cover',snowStep:0,bridgeEasy:false,selected:null,clues:new Set(),cleanup:[]};
  const B=n=>`素材/背景图/${n}`,I=n=>`素材/网页交互/${n}`;
  const scenes={cover:B('A07.webp'),prologue:B('A01.webp'),travel:I('醒醒，准备出发了.jpg'),journey:B('A03.webp'),riverIntro:B('A04.webp'),bridgeIntro:B('A06.webp'),bridgeGuide:I('飞夺泸定桥 队友交代.jpg'),bridgeStory:B('勇士突击.webp'),snowIntro:B('A05.webp'),victory:B('A07-victory.webp'),return:B('A02.webp')};
  const poem=['红军不怕远征难，万水千山只等闲。','五岭逶迤腾细浪，乌蒙磅礴走泥丸。','金沙水拍云崖暖，大渡桥横铁索寒。','更喜岷山千里雪，三军过后尽开颜。'];
  const note='互动情境为游戏创作，具体史实请以权威历史资料为准。';
  const chapters={prologue:1,travel:2,journey:3,riverIntro:4,riverGame:4,bridgeIntro:5,bridgeGuide:5,bridgeGame:5,bridgeStory:5,snowIntro:6,snowGuide:6,snowDirectionGuide:6,snowScene:6,victory:7,return:8,poem:8,lesson:9};
  const img=(n,cls='',alt='')=>`<img class="${cls}" src="${I(n)}" alt="${alt}" ${alt?'':'aria-hidden="true"'}>`;
  const btn=(id,text,ghost=false)=>`<button id="${id}" class="btn ${ghost?'btn-ghost':''}">${text}<span aria-hidden="true">→</span></button>`;
  function later(fn,ms){const id=setTimeout(fn,ms);state.cleanup.push(()=>clearTimeout(id));}
  function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>toast.classList.remove('show'),2500);}
  function dispose(){state.cleanup.splice(0).forEach(fn=>fn());}
  function on(id,fn){document.getElementById(id)?.addEventListener('click',fn);}
  function go(page){dispose();state.page=page;state.selected=null;render();window.scrollTo({top:0,behavior:'instant'});}
  function start(){state.snowStep=0;state.bridgeEasy=false;go('prologue');}
  function head(label){const n=chapters[state.page]||(state.result?.chapter??0);return `<header class="topbar"><button class="brand" id="brand-home" aria-label="返回首页">${img('红星素材扣.webp')}<span>梦赴长征，诗越千山</span></button><div class="chapter-name">${label}</div><div class="chapter-progress">${String(n).padStart(2,'0')} <span>/ 09</span></div></header>`;}
  function foot(text='前面就是下一段路，大家打起精神，互相照应。'){return `<footer class="footer"><span>${text}</span><small>${note}</small></footer>`;}
  function shell(html,cls=''){app.innerHTML=`<section class="frame ${cls}">${html}</section>`;on('brand-home',()=>go('cover'));}
  function guide(text,v='one'){return `<aside class="guide guide-${v}">${v==='two'?'':img('战友扣.webp','guide-portrait','队友')}<div class="guide-bubble"><span class="kicker">队友</span><p>${text}</p></div></aside>`;}
  function hero(page,o){shell(`<div class="hero-backdrop" style="--scene:url('${scenes[page]}')"></div>${head(o.label)}${o.figure||''}<div class="hero-content"><div class="kicker">${o.tag||o.label}</div><h1>${o.title}</h1><p class="narrative">${o.text}</p>${o.extra||''}<div class="actions">${o.action||''}</div>${o.auto?`<div class="auto-caption"><span class="auto-line" style="--duration:${o.duration}ms"></span>${o.auto}</div>`:''}</div>${foot()}`,`hero hero-${page}`);if(o.next)later(()=>go(o.next),o.duration);}
  function cover(){
    shell(`${head('序 · 从一场梦出发')}<div class="cover-art-stage"><img class="cover-art" src="素材/开头/首页合成.webp" alt="梦赴长征，诗越千山"><h1 class="sr-only">梦赴长征，诗越千山</h1><button id="begin" class="cover-art-begin" aria-label="开始征途"><span class="sr-only">开始征途</span></button></div>`,'hero hero-cover cover-image-page');
    on('begin',start);
  }

  function prologue(){hero('prologue',{label:'序章 · 深夜宿舍',title:'空白的页面，<br>未完的思绪。',text:storyText.prologue,figure:img('框1png.webp','prologue-frame'),auto:'思绪渐渐模糊，梦境正在靠近……',duration:24000,next:'travel',action:btn('skip','进入梦境',true)});on('skip',()=>go('travel'));}
  function travel(){
    shell(`${head('意外穿越')}<div class="white-flash"></div><div class="travel-introduction"><h1>意外穿越</h1><p class="narrative">${storyText.travel}</p></div><div class="travel-art-stage"><img class="travel-art" src="${scenes.travel}" alt="崎岖山路上，一名年长的红军战士正在叫醒你，准备出发。"><aside class="travel-dialogue" aria-label="年长战士的呼唤"><span class="kicker">年长战士</span><p>${storyText.travelCall}</p></aside></div><div class="travel-controls actions">${btn('forward','继续前进')}</div>${foot()}`,'hero hero-travel travel-page');
    on('forward',()=>go('journey'));
  }
  function dialogueCard(title,text,label){
    return `<div class="journey-stage dialogue-card"><h1 class="journey-heading">${title}</h1>${img('战友扣.webp','dialogue-portrait','队友')}<aside class="journey-dialogue" aria-label="${label}"><span class="kicker">队友</span><p class="narrative">${text}</p></aside><div class="dialogue-silhouette-band">${img('冲锋2扣.webp','dialogue-silhouettes')}</div></div>`;
  }
  function journey(){
    hero('journey',{label:'征途开始',title:inkPoem('红军不怕远征难，\n万水千山只等闲。','journey-verse','span'),text:storyText.journey,action:btn('to-river','开始征途')+btn('exit','退出游戏',true)});
    revealPoems();
    on('to-river',()=>go('riverIntro'));
    on('exit',()=>{go('cover');notify('感谢参与，长征精神永不落幕。');});
  }

  function intro(page,label,title,next){hero(page,{label,title,text:storyText[page],action:btn('enter',page==='riverIntro'?'查看线索，选择渡口':page==='bridgeIntro'?'听听队友交代':'听听队友提醒')});on('enter',()=>{if(page==='snowIntro')state.snowStep=0;go(next);});}
  function bridgeGuide(){
    shell(`${head('第二关 · 队友交代')}<h1 class="sr-only">队友交代</h1><div class="bridge-guide-stage"><img class="bridge-guide-art" src="${scenes.bridgeGuide}" alt="铁索桥前，一名红军战士向你交代过桥的注意事项。"><aside class="bridge-guide-dialogue" aria-label="队友交代"><span class="kicker">队友交代</span><p class="narrative">${storyText.bridgeGuide}</p></aside></div><div class="bridge-guide-controls actions">${btn('enter-bridge','踏上铁索桥')}</div>${foot()}`,'hero bridge-guide-page');
    on('enter-bridge',()=>go('bridgeGame'));
  }
  function snowGuide(){
    shell(`${head('第三关 · 雪山前的叮嘱')}<h1 class="sr-only">雪山前的叮嘱</h1><div class="snow-guide-stage"><img class="snow-guide-art" src="${I('雪山前提醒.jpg')}" alt="雪山前，一名红军队友提醒你注意风雪，并和大家互相照应。"><aside class="snow-guide-dialogue" aria-label="队友提醒"><span class="kicker">队友</span><p>${storyText.snowGuide}</p></aside></div><div class="snow-guide-controls actions">${btn('enter-snow','进入雪山')}</div>${foot()}`,'hero snow-guide-page');
    on('enter-snow',()=>{state.snowStep=0;go('snowScene');});
  }
  function snowDirectionGuide(){
    const dialogue=snowScenes[2].dialogue;
    let line=0;
    shell(`${head('第三关 · 岔路口的队友对话')}<h1 class="sr-only">寻找前进方向 · 队友对话</h1><div class="snow-direction-stage"><img class="snow-direction-art" src="${I('冻僵遗体 浅色对话框.jpg')}" alt="雪山路旁，一名红军战士倒在积雪中，队友正在和你辨认前进方向。"><aside class="snow-direction-dialogue" aria-label="队友对话"><span class="kicker">队友</span><p id="snow-direction-line">“${dialogue[0]}”</p></aside></div><div class="snow-direction-controls"><span id="snow-direction-count" class="dialogue-count">对话 1 / ${dialogue.length}</span><div class="actions">${btn('snow-direction-next','下一句')}</div></div>${foot()}`,'paper snow-direction-guide-page');
    on('snow-direction-next',()=>{
      if(line===dialogue.length-1){state.snowStep=2;go('snowScene');return;}
      line++;
      document.getElementById('snow-direction-line').textContent=`“${dialogue[line]}”`;
      document.getElementById('snow-direction-count').textContent=`对话 ${line+1} / ${dialogue.length}`;
      if(line===dialogue.length-1)document.getElementById('snow-direction-next').firstChild.textContent='观察岔路，选择方向';
    });
  }
  function options(items,type){return `<div class="option-list" role="group" aria-label="选择行动">${items.map(([key,text])=>`<button class="option" data-${type}="${key}" aria-pressed="false"><span class="option-letter">${key}</span><span>${text}</span><span class="option-check" aria-hidden="true">✓</span></button>`).join('')}</div>`;}
  function bindOptions(type){app.querySelectorAll(`[data-${type}]`).forEach(el=>el.onclick=()=>{state.selected=el.dataset[type];app.querySelectorAll(`[data-${type}]`).forEach(other=>{other.classList.toggle('selected',other===el);other.setAttribute('aria-pressed',String(other===el));});});}
  function riverGame(){state.clues.clear();shell(`${head('第一关 · 巧渡金沙江')}<div class="page-body"><div class="kicker">观察 · 分析 · 判断</div><h1>综合情报，选择渡口。</h1>${guide(storyText.riverGuide)}<div class="river-map"><img class="map-base" src="${I('金沙江卫星影像图.webp')}" alt="金沙江峡谷卫星影像"><div class="map-label">金沙江 · 地形观察</div><button class="map-expand" id="map-expand">查看完整地形图 ↗</button></div><div class="section-heading"><h2>手头的线索</h2><span id="clue-count">已阅 0 / 3</span></div><div class="clue-grid">${clueCards.map((c,i)=>`<button class="clue-card" data-clue="${i}" aria-expanded="false"><span class="clue-front"><small>线索 ${c[0]}</small><strong>${c[1]}</strong><span>点击卡牌翻开 ↗</span></span><span class="clue-back"><small>线索 ${c[0]} · ${c[1]}</small><span>${c[2]}</span><em>线索已记录 ✓</em></span></button>`).join('')}</div><div class="section-heading"><h2>渡口选择</h2><span>综合以上线索，选择你认为正确的渡口。</span></div>${options([['A','皎平渡'],['B','寻找一处看起来最窄的江面，直接强行渡江'],['C','暂停行动，不再作出任何决定']],'river')}<div class="actions">${btn('submit-river','确认选择')}</div></div>${foot()}`,'paper');app.querySelectorAll('[data-clue]').forEach(el=>el.onclick=()=>{const opened=el.classList.toggle('open');el.setAttribute('aria-expanded',String(opened));state.clues.add(Number(el.dataset.clue));document.getElementById('clue-count').textContent=`已阅 ${state.clues.size} / 3`;});bindOptions('river');on('map-expand',openMap);on('submit-river',()=>{if(state.clues.size!==3)return notify('请先翻阅全部三张线索卡');if(!state.selected)return notify('请先选择一个渡口');const key=state.selected==='A'?'success':state.selected==='B'?'narrow':'delay';showResult({...riverOutcomes[key],chapter:4,art:key==='success'?B('A09.webp'):null,artClass:key==='success'?'boat-art':'',award:key==='success'?'river':null});});}
  function openMap(){const modal=document.createElement('dialog');modal.className='map-modal';modal.innerHTML=`<div class="section-heading"><h2>金沙江 · 完整地形图</h2><button class="map-close" aria-label="关闭地图">×</button></div>${img('金沙江卫星影像图.webp','','金沙江完整卫星影像')}<p>结合两岸地形与手头线索，判断可靠的渡江方案。</p>`;app.appendChild(modal);modal.showModal();modal.querySelector('button').onclick=()=>modal.close();modal.addEventListener('close',()=>modal.remove());}
  function inkPoem(text,cls='poem-reveal',tag='p'){
    return `<${tag} class="${cls} ink-poem" aria-label="${text}" aria-live="off">${Array.from(text).map(char=>char==='\n'?'<br>':`<span class="ink-character" aria-hidden="true">${char}</span>`).join('')}</${tag}>`;
  }
  function revealPoems({delay=240,linePause=0}={}){
    const characters=Array.from(app.querySelectorAll('.ink-character'));
    if(!characters.length)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){characters.forEach(char=>char.classList.add('written'));return;}
    let index=0,pauseTicks=0;
    const timer=setInterval(()=>{
      if(pauseTicks>0){pauseTicks--;return;}
      const character=characters[index++];
      character.classList.add('written');
      if(index===characters.length)clearInterval(timer);
      else if(characters[index].parentElement!==character.parentElement)pauseTicks=Math.ceil(linePause/delay);
    },delay);
    state.cleanup.push(()=>clearInterval(timer));
  }
  function showResult(out){state.result=out;go('result');}
  function failureResult(o){
    shell(`<div class="memorial-backdrop" style="--scene:url('${B('纪念.webp')}')" aria-hidden="true"></div>${head('征途中 · 重新挑战')}<div class="failure-layout"><article class="result-copy failure-copy"><header class="failure-heading"><div class="kicker">铭记来路 · 致敬先辈</div><h1>${o.title.replace('——','<br>')}</h1></header><div class="failure-body"><p class="narrative">${o.body}</p><div class="lesson-note"><div><span class="kicker">征途寄语</span><p>${o.lesson.replace('路上致敬','路上<br>致敬')}</p></div></div><div class="actions">${btn('result-next',o.button)}</div></div></article></div>${foot('铭记牺牲，带着信念重新出发。')}`,'hero result failure memorial-page');
    on('result-next',()=>{if(o.advance!=null)state.snowStep=o.advance;go(o.next);});
  }

  function result(){const o=state.result,success=o.kind==='success';if(!success)return failureResult(o);const medal=img(o.award==='river'?'红星.jpg':'红星素材扣.webp','result-medal');shell(`${head(success?'成就已解锁':'征途中 · 重新挑战')}<div class="result-layout"><div class="result-art ${o.artClass||''}"><img src="${o.art}" alt="本段征途的画面">${o.overlay?img(o.overlay,'result-overlay'):''}<span>${success?'山河为证 · 同行的力量':'铭记来路 · 致敬先辈'}</span></div><div class="result-copy"><div class="kicker">${success?'选对了！我们继续赶路。':'这条路行不通，重新想想办法。'}</div><h1>${o.title.replace('！达成','！<br>达成').replace('，达成','<br>达成')}</h1><p class="narrative">${o.body}</p>${success&&o.poem?inkPoem(o.poem):''}<div class="lesson-note">${medal}<div><span class="kicker">${success?'长征精神':'征途寄语'}</span><p>${o.lesson.replace('路上致敬','路上<br>致敬')}</p></div></div><div class="actions">${btn('result-next',o.button)}</div></div></div>${foot()}`,`paper result ${success?'success':'failure'}`);if(success)revealPoems();notify(success?'成就已解锁':'这条路行不通，重新想想办法。');on('result-next',()=>{if(o.advance!=null)state.snowStep=o.advance;go(o.next);});}
  function bridgeGame(){shell(`${head('第二关 · 飞夺泸定桥')}<div class="page-body"><div class="section-heading"><div><div class="kicker">铁索桥上 · 保持平衡</div><h1>稳住重心，向对岸前进。</h1></div><span class="difficulty">${state.bridgeEasy?'队伍协力 · 难度已降低':'桥索开始晃动！'}</span></div><div class="bridge-layout"><div class="bridge-viewport"><div class="bridge-world" id="bridge-world"><img class="bridge-photo" src="${I('ai生成泸定桥.jpg')}" alt="横跨大渡河的铁索桥">${img('小战士过铁索桥.webp','bridge-avatar','正在过桥的小战士')}</div><span class="bridge-location">大渡河 · 泸定桥</span></div><div class="bridge-panel">${img('小红军保持平衡扣.webp','balance-mascot')}<span class="kicker">点击左右按键控制重心</span><h2>每一步，都稳一点。</h2><p>让重心留在中央的安全区域，<br>向对岸不断前进。</p><div class="meter-label"><span>前进进度</span><strong id="progress-label">0%</strong></div><div class="progress-track"><span id="progress-fill"></span></div><div class="meter-label"><span>左侧失衡</span><span>右侧失衡</span></div><div class="balance-track"><div class="safe-zone"></div><span id="balance-needle"></span></div><p id="bridge-status" role="status">桥索开始晃动！</p><div class="controls"><button id="left" aria-label="向左调整重心">←</button><button id="right" aria-label="向右调整重心">→</button></div><small>支持按住按钮，也可使用键盘 ← →</small><button class="pause-button" id="bridge-pause">暂停</button></div></div></div>${foot()}`,'paper');bridgePhysics();}
  function bridgePhysics(){let balance=0,progress=0,elapsed=0,offTime=0,held=0,paused=false;const easy=state.bridgeEasy;const bind=(el,dir)=>{el.addEventListener('pointerdown',e=>{e.preventDefault();held=dir;el.setPointerCapture?.(e.pointerId);});for(const name of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(name,()=>held=0);el.addEventListener('click',e=>{if(e.detail===0)balance+=dir*7;});};bind(document.getElementById('left'),-1);bind(document.getElementById('right'),1);const kd=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();held=e.key==='ArrowLeft'?-1:1;}},ku=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key))held=0;},blur=()=>{held=0;paused=true;document.getElementById('bridge-pause').textContent='继续';},visibility=()=>{if(document.hidden)blur();};window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);state.cleanup.push(()=>{window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);});on('bridge-pause',()=>{paused=!paused;held=0;document.getElementById('bridge-pause').textContent=paused?'继续':'暂停';});const loop=setInterval(()=>{if(paused)return;elapsed+=.1;const sway=(Math.sin(elapsed*1.6)*1.3+Math.sin(elapsed*.73)*.6)*(easy?.7:1.7);balance+=sway+balance*(easy?.008:.018)+held*3.3;balance=Math.max(-60,Math.min(60,balance));offTime=Math.abs(balance)>45?offTime+.1:Math.max(0,offTime-.2);progress+=Math.abs(balance)<45?(easy?.55:.45):.12;document.getElementById('progress-label').textContent=`${Math.min(100,Math.floor(progress))}%`;document.getElementById('progress-fill').style.width=`${Math.min(100,progress)}%`;document.getElementById('balance-needle').style.left=`${50+balance*.78}%`;const avatar=app.querySelector('.bridge-avatar');avatar.style.left=`${50+balance*.35}%`;avatar.style.bottom=`${4+progress*.5}%`;avatar.style.transform=`translateX(-50%) rotate(${balance*.32}deg) scale(${1-progress*.004})`;document.getElementById('bridge-world').style.transform=`rotate(${Math.sin(elapsed*1.6)*(easy?.4:1.2)}deg) scale(1.05)`;document.getElementById('bridge-status').textContent=Math.abs(balance)>40?'重心偏离！向反方向调整。':easy?'队伍互相照应，稳步向前。':'桥索正在晃动，注意保持平衡。';if(offTime>=1.1){dispose();bridgeFail();}else if(progress>=(easy?100:50)){dispose();if(!easy)go('bridgeStory');else bridgeSuccess();}},100);state.cleanup.push(()=>clearInterval(loop));}
  function bridgeFail(){if(!state.bridgeEasy)return go('bridgeStory');showResult({chapter:5,title:'恭喜你达成结局——未竟的征途',body:'这一次，你仍然没能通过铁索桥。你意识到，勇气并不意味着每一次挑战都能成功。面对困难，除了坚定信念，还需要掌握方法、积累经验，并在失败后重新尝试。',lesson:'约8万红一方面军和你一样倒在了长征的路上<br>致敬为突破天险、争取胜利而英勇奋斗的红军战士们。',kind:'failure',button:'重新挑战本关',next:'bridgeGame'});}
  function bridgeSuccess(){showResult({chapter:5,title:'恭喜你，成功抵达对岸！达成成就——飞夺泸定桥',body:'当双脚终于踏上对岸，你紧绷的神经终于放松下来。你曾经因为桥索晃动而恐惧，也曾经因为失败而怀疑自己。但看到突击队奋勇前进的历史画面后，你明白了，困难不会因为恐惧而消失，唯有调整状态、坚定信念，才能一步步接近目标。个人的力量或许有限，但集体的勇气与协作能够帮助人们跨越看似不可逾越的障碍。',lesson:'不畏艰险、勇往直前，在共同目标面前勇于担当。',poem:'大渡桥横铁索寒。',kind:'success',button:'继续前进，进入第三关',next:'snowIntro',art:I('夜晚金沙江峡谷.webp'),artClass:'night-canyon-art',award:'bridge'});}
  function bridgeStory(){hero('bridgeStory',{label:'勇士突击剧情',title:'勇士向前，<br>为队伍打开通路。',text:storyText.bridgeStory,auto:'勇士奋勇夺桥，片刻后自动进入第二次挑战。',duration:17000,next:'bridgeGame',action:btn('retry-bridge','再次挑战')});state.bridgeEasy=true;on('retry-bridge',()=>go('bridgeGame'));}
  function snowScene(){
    const n=state.snowStep,s=snowScenes[n],photo=['冰裂纹.webp','高斯模糊.jpg','道路选择.webp'][n];
    const narrative=s.text.split('\n').map(text=>`<p>${text}</p>`).join('');
    shell(`${head('第三关 · 翻越雪山')}<div class="page-body"><div class="section-heading"><div><div class="kicker">情境 ${['一','二','三'][n]} · 观察后再作决定</div><h1>${s.title}</h1></div><span class="snow-count">${n+1} / 3</span></div><div class="snow-panorama snow-panorama-${n}"><img class="snow-landscape" src="${I(photo)}" alt="${s.title}">${n===1?`<div class="snow-reminder-band" aria-hidden="true"></div>${img('战友扣.webp','snow-reminder-portrait','提醒你的队友')}<div class="snow-dialogue"><span class="kicker">队友提醒</span><p>在高海拔环境下，一旦坐下休息，就很难再次站起来</p></div>`:''}${n!==1?`<span class="panorama-caption">${['冰裂隙 · 相互照应','高海拔 · 寒冷与疲惫','岔路口 · 寻找可靠痕迹'][n]}</span>`:''}</div><div class="narrative snow-narrative">${narrative}</div>${options([['A',s.A],['B',s.B]],'snow')}<div class="actions">${btn('submit-snow','确认选择')}</div></div>${foot()}`,'paper snow');
    bindOptions('snow');
    on('submit-snow',()=>{
      if(!state.selected)return notify('请先作出选择');
      const out=snowOutcomes[n][state.selected],success=out.kind==='success',visuals=[['伸出援手扣.webp','hands-art'],['岷山.jpg',''],['雪山石碑.jpg','memorial-photo']];
      showResult({...out,chapter:6,art:success?I(visuals[n][0]):null,artClass:success?visuals[n][1]:'',button:success?(n===2?'完成雪山挑战，进入最终胜利页面':`进入情境${['二','三'][n]}`):'重新挑战本关',next:success?(n===2?'victory':n===1?'snowDirectionGuide':'snowScene'):'snowScene',advance:success&&n<2?n+1:n});
    });
  }
  function victory(){hero('victory',{label:'最终结局 · 长征胜利',title:'万水千山，<br>终见曙光。',text:`恭喜你，长征胜利！达成最终成就——万水千山，终见曙光。${storyText.victory.split('红军不怕')[0]}`,figure:img('红色鸟图2扣.webp','victory-bird'),auto:'雪山渐渐淡出，故事回到出发的地方……',duration:20000,next:'return',action:btn('return-now','回到现代',true)});on('return-now',()=>go('return'));}
  function returnHome(){hero('return',{label:'穿越结束 · 回到现代',title:'这一次，<br>终于有了头绪。',text:storyText.return,auto:'熟悉的诗句，再次在心中响起……',duration:26000,next:'poem',action:btn('poem-now','重读《七律·长征》',true)});on('poem-now',()=>go('poem'));}
  function poemPage(){shell(`<div class="hero-backdrop" style="--scene:url('${B('A07.webp')}')"></div>${head('完整诗歌 · 七律·长征')}<div class="poem-layout"><div><div class="kicker">山河入诗 · 诗越千山</div>${inkPoem('七律·长征','poem-title','h1')}${inkPoem('毛泽东','poem-author')}<div class="full-poem">${poem.map(l=>inkPoem(l,'poem-line')).join('')}</div><div class="actions">${btn('to-lesson','完成微课')}</div></div></div>${foot('历史不会重演，精神可以传承。')}`,'hero poem-page');revealPoems({delay:160,linePause:640});on('to-lesson',()=>go('lesson'));}
  function lesson(){
    shell(`${head('微课完成 · 精神传承')}<div class="ending-image-body"><img class="ending-poster" src="素材/结尾/结尾页.jpg" alt="我的长征微课结尾：历史不会重演，精神可以传承。热烈庆祝长征胜利90周年。"><div class="actions ending-actions">${btn('restart','重新开始')}${btn('home','返回首页',true)}</div></div>`,'hero lesson-page ending-image-page');
    on('restart',start);on('home',()=>go('cover'));
  }

  function render(){switch(state.page){case 'cover':cover();break;case 'prologue':prologue();break;case 'travel':travel();break;case 'journey':journey();break;case 'riverIntro':intro('riverIntro','第一关 · 巧渡金沙江','在湍流之间，<br>找到稳妥的渡口。','riverGame');break;case 'riverGame':riverGame();break;case 'result':result();break;case 'bridgeIntro':intro('bridgeIntro','第二关 · 飞夺泸定桥','脚下是铁索，<br>前方是彼岸。','bridgeGuide');break;case 'bridgeGuide':bridgeGuide();break;case 'bridgeGame':bridgeGame();break;case 'bridgeStory':bridgeStory();break;case 'snowIntro':intro('snowIntro','第三关 · 翻越雪山','风雪渐起，<br>队伍继续前行。','snowGuide');break;case 'snowGuide':snowGuide();break;case 'snowDirectionGuide':snowDirectionGuide();break;case 'snowScene':snowScene();break;case 'victory':victory();break;case 'return':returnHome();break;case 'poem':poemPage();break;case 'lesson':lesson();break;default:go('cover');}}
  render();
})();

