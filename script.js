const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');menuButton.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰'}));const freq=document.querySelector('#freq'),value=document.querySelector('#freq-value'),screen=document.querySelector('#screen-freq'),wave=document.querySelector('#wave'),status=document.querySelector('#signal-status'),message=document.querySelector('#received-message'),led=document.querySelector('.receiver-led');for(let i=0;i<45;i++){const bar=document.createElement('i');bar.style.height=`${12+Math.abs(Math.sin(i*.31)*Math.cos(i*.12))*53}px`;bar.style.setProperty('--delay',`${i*-.042}s`);wave.append(bar)}freq.addEventListener('input',()=>{value.textContent=freq.value;screen.textContent=freq.value;message.textContent='AWAITING TRANSMISSION...';status.textContent='周波数を変更しました。受信してみましょう。';wave.classList.remove('active');led.classList.remove('active');led.textContent='● STANDBY'});const messages=['「今日のきみが、昨日より少し好きになれますように。」','「遠い星の光も、いつかはちゃんと届くんだよ。」','「おやすみ。また同じ空の下で会おうね。」','「もし迷子になったら、北極星を探してみて。」','「今夜の宇宙は、いつもより優しい気がする。」'];let transmissions=0;document.querySelector('#receive').addEventListener('click',()=>{const selected=Number(freq.value),inRange=Math.abs(selected-87.7)<=.3;if(inRange){message.textContent=messages[transmissions++%messages.length];status.textContent='通信成功。星詠ミオからメッセージが届きました。';led.textContent='● CONNECTED';led.classList.add('active');wave.classList.add('active')}else{message.textContent='... STATIC ... NO SIGNAL ...';status.textContent='ノイズが聞こえます。87.7 MHz付近に合わせてみてください。';led.textContent='● SEARCHING';led.classList.remove('active');wave.classList.remove('active')}});
// News categories
const newsButtons=[...document.querySelectorAll('[data-news-filter]')];
newsButtons.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.newsFilter;newsButtons.forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button))});let shown=0;document.querySelectorAll('.news-item').forEach(item=>{const show=filter==='all'||item.dataset.newsCategory===filter;item.hidden=!show;if(show)shown++});document.querySelector('.news-empty').hidden=shown>0}));
// Accessible artwork lightbox
const artDialog=document.querySelector('#art-dialog');
document.querySelectorAll('.art-tile').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#dialog-image').src=button.dataset.art;document.querySelector('#dialog-image').alt=button.dataset.artTitle;document.querySelector('#dialog-title').textContent=button.dataset.artTitle;artDialog.showModal()}));
document.querySelector('#close-art').addEventListener('click',()=>artDialog.close());
artDialog.addEventListener('click',event=>{if(event.target===artDialog)artDialog.close()});
// Star atlas: seven discoverable points with a locally remembered constellation.
const starStories=[
 '北の空に見つけた最初の光。ミオはここで望遠鏡を手にしました。',
 '二つ目の星は、古いラジオのダイヤルに似ています。',
 '三つ目の星のそばでは、いつも流星群が見えるんです。',
 '四つ目は秘密のクリームソーダ星。淡い水色に輝きます。',
 '五つ目の星から届いた信号は、たった七音でした。',
 '六つ目の星は、帰り道を照らしてくれる星。',
 '七つ目の星が見つかりました。もう、ひとりぼっちじゃありません。'
];
const starButtons=[...document.querySelectorAll('.sky-star')];
const starPositions=[[16,26],[36,12],[64,25],[82,43],[66,78],[33,73],[16,51]];
const safeStorage={read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}},write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}};
let foundStars=new Set((safeStorage.read('mio-found-stars',[])).filter(n=>Number.isInteger(n)&&n>=0&&n<7));
function drawStarMap(){const count=foundStars.size;document.querySelector('#star-count').textContent=String(count);starButtons.forEach((btn,i)=>{btn.classList.toggle('found',foundStars.has(i));btn.setAttribute('aria-pressed',String(foundStars.has(i)))});const svg=document.querySelector('#star-lines');svg.replaceChildren();for(let i=0;i<7;i++){const next=(i+1)%7;if(foundStars.has(i)&&foundStars.has(next)){const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',starPositions[i][0]*6);line.setAttribute('y1',starPositions[i][1]*5.2);line.setAttribute('x2',starPositions[next][0]*6);line.setAttribute('y2',starPositions[next][1]*5.2);svg.append(line)}}document.querySelector('#star-secret').hidden=count!==7}
starButtons.forEach((btn,i)=>btn.addEventListener('click',()=>{foundStars.add(i);safeStorage.write('mio-found-stars',[...foundStars]);drawStarMap();document.querySelector('#star-story').textContent=starStories[i];if(foundStars.size===7)playStarChime()}));
document.querySelector('#reset-stars').addEventListener('click',()=>{foundStars.clear();safeStorage.write('mio-found-stars',[]);drawStarMap();document.querySelector('#star-story').textContent='すべての星をリセットしました。もう一度、光を集めましょう。'});
drawStarMap();
// Letters never leave the browser. Text is safely inserted with textContent.
const letterBody=document.querySelector('#letter-body');
let letters=safeStorage.read('mio-private-letters',[]);
if(!Array.isArray(letters))letters=[];
letters=letters.filter(v=>v&&typeof v.text==='string'&&typeof v.date==='string').slice(0,30);
letterBody.addEventListener('input',()=>document.querySelector('#letter-length').textContent=`${letterBody.value.length} / 280`);
function renderLetters(){const list=document.querySelector('#letter-list');list.replaceChildren();document.querySelector('#letter-total').textContent=`${letters.length} LETTERS`;if(!letters.length){const li=document.createElement('li');li.textContent='まだ手紙はありません。';list.append(li);return}letters.forEach((letter,index)=>{const li=document.createElement('li');const div=document.createElement('div');const time=document.createElement('time');time.textContent=letter.date;const p=document.createElement('span');p.textContent=letter.text;div.append(time,p);const remove=document.createElement('button');remove.type='button';remove.setAttribute('aria-label',`${index+1}番目の手紙を削除する`);remove.textContent='削除';remove.addEventListener('click',()=>{letters.splice(index,1);safeStorage.write('mio-private-letters',letters);renderLetters()});li.append(div,remove);list.append(li)})}
document.querySelector('#letter-form').addEventListener('submit',event=>{event.preventDefault();const value=letterBody.value.trim();if(!value)return;letters.unshift({text:value,date:new Date().toLocaleString('ja-JP',{dateStyle:'medium',timeStyle:'short'})});letters=letters.slice(0,30);const stored=safeStorage.write('mio-private-letters',letters);letterBody.value='';document.querySelector('#letter-length').textContent='0 / 280';document.querySelector('#letter-feedback').textContent=stored?'このブラウザの中に手紙を保存しました。':'保存できませんでした。ブラウザの保存設定を確認してください。';renderLetters()});
renderLetters();
// Wallpaper maker: programmatic celestial backgrounds + generated character PNG.
const wallpaperCanvas=document.querySelector('#wallpaper-preview');const wallpaperCtx=wallpaperCanvas.getContext('2d');const sizes={mobile:[1080,1920],desktop:[1920,1080],square:[1080,1080]};let wallpaperSeed=1314;
const wallpaperArt=new Image();wallpaperArt.src='assets/mio-hero-art.png';
function seeded(seed){let t=seed>>>0;return ()=>{t=(t*1664525+1013904223)>>>0;return t/4294967296}}
function renderWallpaper(){const mode=document.querySelector('#wallpaper-size').value;const [w,h]=sizes[mode];wallpaperCanvas.width=w;wallpaperCanvas.height=h;const c=wallpaperCtx,rand=seeded(wallpaperSeed),grad=c.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#070c22');grad.addColorStop(.45,'#263b70');grad.addColorStop(1,'#101329');c.fillStyle=grad;c.fillRect(0,0,w,h);const glow=c.createRadialGradient(w*.65,h*.38,0,w*.65,h*.38,w*.8);glow.addColorStop(0,'#b48cde66');glow.addColorStop(1,'#b48cde00');c.fillStyle=glow;c.fillRect(0,0,w,h);for(let i=0;i<500;i++){const x=rand()*w,y=rand()*h,r=.4+rand()*2.2;c.fillStyle=`rgba(238,242,255,${.25+rand()*.75})`;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}c.strokeStyle='#d7daff50';c.lineWidth=2;c.beginPath();c.ellipse(w*.54,h*.48,w*.42,h*.22,-.28,0,Math.PI*2);c.stroke();if(wallpaperArt.complete&&wallpaperArt.naturalWidth){const scale=Math.min((w*(mode==='desktop'?.60:.98))/wallpaperArt.width,(h*(mode==='desktop'?.9:.62))/wallpaperArt.height);const iw=wallpaperArt.width*scale,ih=wallpaperArt.height*scale;c.drawImage(wallpaperArt,mode==='desktop'?w*.44:(w-iw)/2,mode==='desktop'?(h-ih)/2:h*.34,iw,ih)}c.textAlign=mode==='desktop'?'left':'center';const tx=mode==='desktop'?w*.08:w/2;const ty=mode==='desktop'?h*.44:h*.24;c.fillStyle='#f3f0fc';c.font=`700 ${Math.round(w*(mode==='desktop'?.042:.073))}px 'Noto Sans JP',sans-serif`;c.fillText('星詠ミオ',tx,ty);c.fillStyle='#abeee6';c.font=`${Math.round(w*(mode==='desktop'?.015:.029))}px 'DM Mono',monospace`;c.fillText('HOSHIYOMI MIO',tx,ty+Math.round(w*.055));c.fillStyle='#e5dcee';c.font=`${Math.round(w*(mode==='desktop'?.016:.026))}px 'Noto Sans JP',sans-serif`;c.fillText('星の声が、きこえる。',tx,mode==='desktop'?ty+Math.round(w*.1):h*.88);c.textAlign='center';c.fillStyle='#aec8da';c.font=`${Math.round(w*.013)}px 'DM Mono',monospace`;c.fillText('OBSERVATORY 07  ·  FICTIONAL CHARACTER',w/2,h*.95);document.querySelector('#wallpaper-status').textContent=`プレビュー更新：${w} × ${h} px`}
wallpaperArt.addEventListener('load',renderWallpaper);wallpaperArt.addEventListener('error',()=>{document.querySelector('#wallpaper-status').textContent='画像素材の読み込みに失敗しました。';renderWallpaper()});
document.querySelector('#wallpaper-size').addEventListener('change',renderWallpaper);
document.querySelector('#wallpaper-refresh').addEventListener('click',()=>{wallpaperSeed+=173;renderWallpaper()});
document.querySelector('#wallpaper-download').addEventListener('click',()=>{renderWallpaper();wallpaperCanvas.toBlob(blob=>{if(!blob){document.querySelector('#wallpaper-status').textContent='画像を保存できませんでした。';return}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`hoshiyomi-mio-${document.querySelector('#wallpaper-size').value}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')});
// Original notification chime; sound plays only after a click.
function playStarChime(){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;const audio=new Ctx();[659.25,783.99,987.77,1318.51].forEach((hz,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),start=audio.currentTime+i*.12;osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.035,start+.018);gain.gain.exponentialRampToValueAtTime(.0001,start+.6);osc.connect(gain).connect(audio.destination);osc.start(start);osc.stop(start+.62)});setTimeout(()=>audio.close(),1700)}catch{}}
if(wallpaperArt.complete&&wallpaperArt.naturalWidth)renderWallpaper();
// Theme preference saved only on this browser.
const themeButton=document.querySelector('#theme-toggle');
let currentTheme=safeStorage.read('mio-theme','midnight');
if(currentTheme!=='violet')currentTheme='midnight';
function applyMioTheme(){document.body.dataset.theme=currentTheme;themeButton.textContent=currentTheme==='violet'?'☀':'☾';themeButton.setAttribute('aria-label',currentTheme==='violet'?'夜空色のテーマに切り替える':'すみれ色のテーマに切り替える')}
themeButton.addEventListener('click',()=>{currentTheme=currentTheme==='midnight'?'violet':'midnight';safeStorage.write('mio-theme',currentTheme);applyMioTheme()});applyMioTheme();
// Synthetic reading uses the device/browser voice; no recorded actor voices are implied.
const speakButtons=[...document.querySelectorAll('[data-speak]')],voiceStatus=document.querySelector('#voice-status');
function stopSpeech(){if('speechSynthesis' in window)window.speechSynthesis.cancel();speakButtons.forEach(b=>b.classList.remove('active'))}
speakButtons.forEach(button=>button.addEventListener('click',()=>{stopSpeech();if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){voiceStatus.textContent='このブラウザでは音声合成を利用できません。';return}const utterance=new SpeechSynthesisUtterance(button.dataset.speak);utterance.lang='ja-JP';utterance.pitch=1.15;utterance.rate=.93;utterance.volume=.9;const voices=window.speechSynthesis.getVoices();const japanese=voices.filter(v=>v.lang.toLowerCase().startsWith('ja'));utterance.voice=japanese.find(v=>/nanami|kyoko|haruka|female/i.test(v.name))||japanese[0]||null;utterance.onend=()=>{button.classList.remove('active');voiceStatus.textContent='読み上げを終了しました。'};utterance.onerror=()=>{button.classList.remove('active');voiceStatus.textContent='音声合成を再生できませんでした。ブラウザの音声設定を確認してください。'};button.classList.add('active');voiceStatus.textContent='端末の音声合成で読み上げています。';window.speechSynthesis.speak(utterance)}));
document.querySelector('#stop-voice').addEventListener('click',()=>{stopSpeech();voiceStatus.textContent='音声合成を停止しました。'});
// Original procedural ambient soundtrack: simple pentatonic tones, no media file.
let ambientContext=null,ambientGain=null,ambientTimer=null,ambientStep=0;
const ambientButton=document.querySelector('#ambient-toggle'),ambientVolume=document.querySelector('#ambient-volume'),ambientStatus=document.querySelector('#ambient-status');
const sequence=[261.63,329.63,392,523.25,392,329.63,293.66,392,523.25,659.25,523.25,392,349.23,293.66,261.63,196];
function playAmbientNote(){if(!ambientContext||ambientContext.state==='closed')return;const at=ambientContext.currentTime+.015;const hz=sequence[ambientStep%sequence.length];const sound=ambientContext.createOscillator(),envelope=ambientContext.createGain();sound.type=ambientStep%4===0?'sine':'triangle';sound.frequency.setValueAtTime(hz,at);envelope.gain.setValueAtTime(.00001,at);envelope.gain.exponentialRampToValueAtTime(.17,at+.08);envelope.gain.exponentialRampToValueAtTime(.00001,at+1.65);sound.connect(envelope).connect(ambientGain);sound.start(at);sound.stop(at+1.67);ambientStep++}
function stopAmbient(){if(ambientTimer!==null){clearInterval(ambientTimer);ambientTimer=null}if(ambientGain&&ambientContext){ambientGain.gain.setTargetAtTime(0,ambientContext.currentTime,.08)}if(ambientContext){const closing=ambientContext;setTimeout(()=>closing.close().catch(()=>{}),300)}ambientContext=null;ambientGain=null;ambientButton.textContent='▶';ambientButton.setAttribute('aria-pressed','false');ambientStatus.textContent='STOPPED'}
ambientButton.addEventListener('click',()=>{if(ambientContext){stopAmbient();return}try{const AudioClass=window.AudioContext||window.webkitAudioContext;if(!AudioClass){ambientStatus.textContent='AUDIO UNAVAILABLE';return}ambientContext=new AudioClass();ambientGain=ambientContext.createGain();ambientGain.gain.value=Number(ambientVolume.value)/100*.5;ambientGain.connect(ambientContext.destination);ambientButton.textContent='Ⅱ';ambientButton.setAttribute('aria-pressed','true');ambientStatus.textContent='PLAYING · ORIGINAL SYNTH';playAmbientNote();ambientTimer=setInterval(playAmbientNote,480)}catch{stopAmbient();ambientStatus.textContent='AUDIO ERROR'}});
ambientVolume.addEventListener('input',()=>{if(ambientGain&&ambientContext)ambientGain.gain.setTargetAtTime(Number(ambientVolume.value)/100*.5,ambientContext.currentTime,.05)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&ambientContext)stopAmbient()});
// Chibi assistant: interactions are intentionally local, not a networked chat.
const helperToggle=document.querySelector('#helper-toggle'),helperBubble=document.querySelector('#helper-bubble'),helperMessage=document.querySelector('#helper-message'),favoriteButton=document.querySelector('#helper-favorite');
const helperMessages=['やっほー！ 星を見にきてくれてありがとう。','夜の観測所には、七つの星が隠れているんだ。','87.7 MHzの通信は受信してみた？','自分だけの壁紙が作れるんだって。','明日も、同じ空の下で会おうね。'];
let helperMessageNumber=0,favoriteSaved=Boolean(safeStorage.read('mio-favorite',false));
function renderFavorite(){favoriteButton.textContent=favoriteSaved?'★ お気に入り登録済み':'☆ お気に入り';favoriteButton.setAttribute('aria-pressed',String(favoriteSaved))}
helperToggle.addEventListener('click',()=>{const opening=helperBubble.hidden;if(opening){helperMessage.textContent=helperMessages[helperMessageNumber++%helperMessages.length]}helperBubble.hidden=!opening;helperToggle.setAttribute('aria-expanded',String(opening));helperToggle.setAttribute('aria-label',opening?'ミオのメッセージを閉じる':'ミオのメッセージを開く')});
document.querySelector('#helper-dismiss').addEventListener('click',()=>{helperBubble.hidden=true;helperToggle.setAttribute('aria-expanded','false');helperToggle.focus()});
favoriteButton.addEventListener('click',()=>{favoriteSaved=!favoriteSaved;safeStorage.write('mio-favorite',favoriteSaved);renderFavorite();helperMessage.textContent=favoriteSaved?'ありがとう！ このブラウザでお気に入りを覚えておくね。':'お気に入りの設定を解除したよ。'});
renderFavorite();
// The fictional schedule is generated locally, never fetched from a real service.
const jstParts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).map(p=>[p.type,Number(p.value)]));
let scheduleYear=jstParts.year,scheduleMonth=jstParts.month;
const eventNotes={7:'小さな通信日：ミオが遠い星に向かって一通の電波を送る日。',18:'星屑ノート更新：観測所の古いノートに、星のかけらが一つ加わります。',25:'深夜の観測会：今夜の星の物語を、いっしょに数えてみましょう。'};
function renderCalendar(){document.querySelector('#calendar-title').textContent=`${scheduleYear}年${scheduleMonth}月`;const days=document.querySelector('#calendar-days');days.replaceChildren();const first=new Date(scheduleYear,scheduleMonth-1,1).getDay(),last=new Date(scheduleYear,scheduleMonth,0).getDate();for(let i=0;i<first;i++){const span=document.createElement('span');span.className='calendar-blank';span.setAttribute('aria-hidden','true');days.append(span)}for(let day=1;day<=last;day++){const button=document.createElement('button');button.type='button';button.textContent=String(day);const event=eventNotes[day];if(event)button.classList.add('has-event');if(scheduleYear===jstParts.year&&scheduleMonth===jstParts.month&&day===jstParts.day)button.classList.add('today');button.setAttribute('aria-label',`${scheduleYear}年${scheduleMonth}月${day}日${event?'、'+event:''}`);button.addEventListener('click',()=>{days.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));button.classList.add('selected');document.querySelector('#schedule-selected').textContent=`${scheduleYear}年${scheduleMonth}月${day}日 · ${event||'この日は観測所の静かな休日です。'}`});days.append(button)}}
function moveCalendar(direction){scheduleMonth+=direction;if(scheduleMonth<1){scheduleMonth=12;scheduleYear--}else if(scheduleMonth>12){scheduleMonth=1;scheduleYear++}renderCalendar();document.querySelector('#schedule-selected').textContent=`${scheduleYear}年${scheduleMonth}月を表示しています。星印の日を選んでください。`}
document.querySelector('#prev-month').addEventListener('click',()=>moveCalendar(-1));document.querySelector('#next-month').addEventListener('click',()=>moveCalendar(1));renderCalendar();
// Observation log entries open full stories rather than presenting inert arrows.
const observationStories=[
 '新しいアンテナの箱を開けると、そこには星のように輝く小さなネジが入っていました。いつもの古いアンテナより遠くまで聞こえるかな、と胸が高鳴ります。夜が深くなったころ、イヤホンの向こうでほんの一秒だけ、知らない誰かの声に似た音がしました。明日も、もう一度聞いてみようと思います。',
 'しし座の方角から、七回だけ繰り返す不思議な音が届きました。規則正しくて、少し照れくさそうなリズム。きっと偶然なのに、私は返事を送りたくなってしまいます。「こんばんは、ここにいるよ」。次の夜も同じ音が届くかどうかは、まだ誰にも分かりません。',
 '今日のご褒美は、さくらんぼが二つのったクリームソーダ。観測所の窓に青い彗星のような光が走って、思わずスプーンが止まりました。あの光を見た誰かも、今ごろ同じように驚いているのかな。そんなことを考えながら、甘い夜を過ごしました。'
];
const logDialog=document.querySelector('#log-dialog');
document.querySelectorAll('.log-item').forEach((article,index)=>{article.querySelector('.log-arrow').addEventListener('click',()=>{document.querySelector('#log-dialog-title').textContent=article.querySelector('h3').textContent;document.querySelector('#log-dialog-body').textContent=observationStories[index]||'';logDialog.showModal()})});
document.querySelector('#close-log').addEventListener('click',()=>logDialog.close());
logDialog.addEventListener('click',event=>{if(event.target===logDialog)logDialog.close()});
// Generated prop archive — local lore, no external links or fictitious sales claims.
const equipmentLore=[
 'ミオがいつも身につけている星形の髪飾り。誰かからもらった大切な贈り物だけれど、送り主の名前だけが思い出せません。',
 '七番観測所の古い望遠鏡。レンズの端に小さな星形の傷があります。遠い星を見るより、今夜の空を誰かと分け合うための道具です。',
 '丘の上にぽつんと建つ七番観測所。夜になると窓に小さな光が灯り、今日もミオがひとり、星の声を探しています。'
];
document.querySelectorAll('[data-equipment]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.equipment);document.querySelectorAll('[data-equipment]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button))});document.querySelector('#equipment-tag').textContent=`COLLECTION NO. 0${index+1}`;document.querySelector('#equipment-description').textContent=equipmentLore[index]}));
// Global section finder, no external search service.
const searchableSections=[
 ['about','ABOUT','プロフィール','星詠ミオの設定 身長 誕生日 趣味'],
 ['news','NEWS','お知らせ','公式サイト 新着 更新ニュース'],
 ['equipment','OBJECTS','ミオの宝物','髪飾り 望遠鏡 天文台 小道具'],
 ['signal','SIGNAL','宇宙通信','87.7 MHz ラジオ メッセージ'],
 ['voice','VOICE','音声とBGM','セリフ 読み上げ 音声合成 電子音'],
 ['schedule','SCHEDULE','観測カレンダー','予定 イベント 架空'],
 ['log','LOG','星屑の日誌','観測記録 ストーリー'],
 ['gallery','GALLERY','イラスト集','ギャラリー イラスト 立ち絵'],
 ['star-map','STAR MAP','七つの星探し','ゲーム 星図 隠しメッセージ'],
 ['letter','LETTER','星への手紙','メモ お便り 保存'],
 ['wallpaper','WALLPAPER','壁紙メーカー','画像 ダウンロード PNG']
];
const searchDialog=document.querySelector('#site-search'),searchInput=document.querySelector('#site-search-input'),searchResults=document.querySelector('#site-search-results');
function populateSearch(){searchResults.replaceChildren();const query=searchInput.value.trim().toLocaleLowerCase('ja-JP');let count=0;for(const [id,label,title,keywords] of searchableSections){if(!`${label} ${title} ${keywords}`.toLocaleLowerCase('ja-JP').includes(query))continue;const button=document.createElement('button');button.type='button';button.className='site-search-result';const n=document.createElement('span');n.textContent=String(++count).padStart(2,'0');const detail=document.createElement('span');const strong=document.createElement('strong');strong.textContent=title;const small=document.createElement('small');small.textContent=label;detail.append(strong,small);button.append(n,detail);button.addEventListener('click',()=>{searchDialog.close();document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});searchResults.append(button)}if(count===0){const p=document.createElement('p');p.className='site-search-empty';p.textContent='見つかりませんでした。別のキーワードを試してください。';searchResults.append(p)}}
function openSiteSearch(){if(searchDialog.open)return;searchInput.value='';populateSearch();searchDialog.showModal();searchInput.focus()}
document.querySelector('#search-open').addEventListener('click',openSiteSearch);
document.querySelector('#search-close').addEventListener('click',()=>searchDialog.close());
searchInput.addEventListener('input',populateSearch);
document.querySelector('#site-search-form').addEventListener('submit',event=>{event.preventDefault();searchResults.querySelector('button')?.click()});
document.addEventListener('keydown',event=>{const typing=event.target instanceof HTMLElement&&(['INPUT','TEXTAREA'].includes(event.target.tagName)||event.target.isContentEditable);if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(searchDialog.open)searchDialog.close();else openSiteSearch()}else if(event.key==='/'&&!typing&&!searchDialog.open&&!event.altKey&&!event.ctrlKey&&!event.metaKey){event.preventDefault();openSiteSearch()}});
// Lightweight scroll state and current-section link highlight.
const scrollProgress=document.querySelector('#scroll-progress'),topButton=document.querySelector('#to-top');let scrollPending=false;
function updateScrolling(){const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);scrollProgress.style.transform=`scaleX(${Math.max(0,Math.min(1,window.scrollY/max))})`;topButton.classList.toggle('visible',window.scrollY>900);scrollPending=false}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScrolling)}},{passive:true});
topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}},{rootMargin:'-20% 0px -65% 0px',threshold:0});document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section))}
updateScrolling();
// Original branching narrative — all routes are stored and played locally.
const storyNodes={
 intro:{chapter:'PROLOGUE',line:'「おかえり。今夜はどんな星を見つけたい？」',choices:[['ラジオのつまみを回す','radio'],['望遠鏡をのぞく','sky'],['クリームソーダを一緒に飲む','soda']]},
 radio:{chapter:'CHAPTER 01 · SIGNAL',line:'「あっ、聞こえた？ この七つの音……もしかして、誰かからのお返事かな。」',choices:[['『ここにいるよ』と返事する','signal-ending'],['電波の行き先を望遠鏡で探す','sky']]},
 sky:{chapter:'CHAPTER 02 · STARDUST',line:'「見て！ あんなに遠い光なのに、今夜の私たちまでちゃんと届いたんだ。」',choices:[['ふたりで流星に願いごとをする','sky-ending'],['星が消える前に休憩をすすめる','soda']]},
 soda:{chapter:'CHAPTER 03 · CREAM SODA',line:'「ふふ、さくらんぼは半分こ。星の数より、今日は話したいことがたくさんあるの。」',choices:[['また明日も来ると約束する','soda-ending'],['今度はラジオの音を聞いてみる','radio']]},
 'signal-ending':{chapter:'ENDING 01 · RESPONSE',line:'「……届いた！ 誰かの声が聞こえるって、こんなに温かいんだね。きみが返事をくれたからだよ。」',ending:'signal'},
 'sky-ending':{chapter:'ENDING 02 · METEOR',line:'「願いごと、何にしたの？ ……内緒？ じゃあ私も、きみとまた同じ空を見られますように。」',ending:'sky'},
 'soda-ending':{chapter:'ENDING 03 · PROMISE',line:'「約束だよ。明日の夜も、同じ席で待ってる。さくらんぼは、きみの分も残しておくね。」',ending:'soda'}
};
let collectedEndings=new Set((safeStorage.read('mio-story-endings',[])).filter(v=>['signal','sky','soda'].includes(v)));
let activeStory='intro';
function renderNovel(){const node=storyNodes[activeStory];if(node.ending){collectedEndings.add(node.ending);safeStorage.write('mio-story-endings',[...collectedEndings])}document.querySelector('#story-step').textContent=node.chapter;document.querySelector('#story-line').textContent=node.line;document.querySelector('#story-counter').textContent=`ENDINGS ${collectedEndings.size} / 3`;for(const badge of document.querySelectorAll('[data-ending-badge]'))badge.classList.toggle('collected',collectedEndings.has(badge.dataset.endingBadge));document.querySelector('#story-secret').hidden=collectedEndings.size!==3;const choices=document.querySelector('#story-choices');choices.replaceChildren();for(const [text,target] of node.choices||[['別の未来を探す','intro']]){const button=document.createElement('button');button.type='button';button.className='story-choice';button.textContent=text;button.addEventListener('click',()=>{activeStory=target;renderNovel()});choices.append(button)}}
document.querySelector('#story-restart').addEventListener('click',()=>{activeStory='intro';renderNovel()});renderNovel();
// Make narrative discoverable from the global site finder.
searchableSections.splice(searchableSections.findIndex(item=>item[0]==='gallery'),0,['story','STORY','分岐する星の物語','ノベル エンディング 選択肢 読む ゲーム']);

// Offline shell for returning visitors; registration failure never blocks the website.
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
// Download the original generated illustration directly from the gallery.
document.querySelectorAll('.art-tile').forEach((button,index)=>button.addEventListener('click',()=>{const a=document.querySelector('#download-art');a.href=button.dataset.art;a.download=`hoshiyomi-mio-gallery-${String(index+1).padStart(2,'0')}.png`}));
// Explicit share action, with feedback that does not depend on an external provider.
document.querySelector('#site-share').addEventListener('click',async event=>{const button=event.currentTarget;const link=window.location.origin+window.location.pathname;try{await navigator.clipboard.writeText(link);button.textContent='コピーしました ✓'}catch{button.textContent='コピーできませんでした';window.prompt('サイトのURLはこちらです',link)}setTimeout(()=>{button.textContent='サイトURLをコピー ⧉'},2500)});

// The observatory's clock always uses Japan Standard Time, independent of visitor timezone.
const observatoryClock=document.querySelector('#observatory-clock');
const jstClockFormatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
function refreshObservatoryClock(){const now=new Date();observatoryClock.textContent=jstClockFormatter.format(now);observatoryClock.dateTime=observatoryClock.textContent}
refreshObservatoryClock();setInterval(refreshObservatoryClock,1000);
// Fictional membership card: nickname and achievements stay in localStorage.
const fanCanvas=document.querySelector('#fan-card'),fanCtx=fanCanvas.getContext('2d'),fanNameInput=document.querySelector('#fan-name'),fanStatus=document.querySelector('#fan-status');
let fanNickname=safeStorage.read('mio-fan-nickname','星の観測者');
if(typeof fanNickname!=='string')fanNickname='星の観測者';
fanNickname=fanNickname.slice(0,16);fanNameInput.value=fanNickname;
let fanPassNumber=safeStorage.read('mio-fan-number',null);
if(!Number.isInteger(fanPassNumber)||fanPassNumber<100000||fanPassNumber>999999){fanPassNumber=Math.floor(Math.random()*900000)+100000;safeStorage.write('mio-fan-number',fanPassNumber)}
const fanArt=new Image();fanArt.src='assets/mio-chibi-art.png';
function renderFanCard(){const c=fanCtx,w=fanCanvas.width,h=fanCanvas.height,rand=seeded(7731);const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#0c1736');bg.addColorStop(.5,'#334974');bg.addColorStop(1,'#1a1c46');c.fillStyle=bg;c.fillRect(0,0,w,h);for(let i=0;i<210;i++){c.fillStyle=`rgba(240,244,255,${.25+rand()*.55})`;c.beginPath();c.arc(rand()*w,rand()*h,.5+rand()*1.7,0,Math.PI*2);c.fill()}c.strokeStyle='#a5e4dc99';c.lineWidth=4;c.strokeRect(22,22,w-44,h-44);c.beginPath();c.ellipse(710,330,270,165,-.22,0,Math.PI*2);c.stroke();if(fanArt.complete&&fanArt.naturalWidth){const iw=520,ih=iw*fanArt.height/fanArt.width;c.drawImage(fanArt,445,248,iw,ih)}c.fillStyle='#b8f5e5';c.font='24px "DM Mono",monospace';c.fillText('✳  THE SEVENTH OBSERVATORY SOCIETY',67,83);c.fillStyle='#fffaf9';c.font='bold 58px "Noto Sans JP",sans-serif';c.fillText('星詠ミオ観測団',65,182);c.fillStyle='#dbcfe9';c.font='21px "DM Mono",monospace';c.fillText('LOCAL MEMBER PASS',69,220);c.fillStyle='#a5e4dc';c.font='20px "DM Mono",monospace';c.fillText('NICKNAME',68,312);c.fillStyle='#fffaf9';c.font='bold 44px "Noto Sans JP",sans-serif';const display=fanNickname||'星の観測者';c.fillText(display,66,368,560);c.fillStyle='#d5e7ec';c.font='19px "DM Mono",monospace';c.fillText(`STARS: ${foundStars.size}/7  ·  ENDINGS: ${collectedEndings.size}/3`,68,443);c.fillStyle='#bbcbde';c.font='19px "DM Mono",monospace';c.fillText(`PASS NO. MIO-07-${fanPassNumber}`,68,510);c.fillStyle='#a5e4dc';c.font='15px "DM Mono",monospace';c.fillText('FICTIONAL · STORED ONLY ON YOUR DEVICE',68,551);fanStatus.textContent=`${display} のカードを更新しました。 星 ${foundStars.size}/7、結末 ${collectedEndings.size}/3`}
fanArt.addEventListener('load',renderFanCard);fanArt.addEventListener('error',renderFanCard);
document.querySelector('#fan-form').addEventListener('submit',event=>{event.preventDefault();fanNickname=fanNameInput.value.trim().slice(0,16)||'星の観測者';fanNameInput.value=fanNickname;safeStorage.write('mio-fan-nickname',fanNickname);renderFanCard()});
document.querySelector('#fan-download').addEventListener('click',()=>{renderFanCard();fanCanvas.toBlob(blob=>{if(!blob){fanStatus.textContent='PNGの生成に失敗しました。';return}const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='hoshiyomi-mio-fan-pass.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},'image/png')});
document.addEventListener('click',event=>{if(event.target.closest('.sky-star,.story-choice,#story-restart,#reset-stars'))renderFanCard()});
searchableSections.push(['fanclub','FANCLUB','観測団のファンカード','会員風カード 名前 PNG 保存 星 エンディング']);
if(fanArt.complete)renderFanCard();
// Local scenario chat. Input is never saved or sent anywhere.
const chatLog=document.querySelector('#chat-log'),chatInput=document.querySelector('#chat-input'),chatStatus=document.querySelector('#chat-status');
let latestMioReply='',chatReplyIndex=0;
function appendChat(role,content){const article=document.createElement('article');article.className='chat-bubble '+role;const label=document.createElement('small');label.textContent=role==='mio'?'MIO / SCRIPTED RESPONSE':'YOU / LOCAL ONLY';const p=document.createElement('p');p.textContent=content;article.append(label,p);chatLog.append(article);chatLog.scrollTop=chatLog.scrollHeight}
function scriptedMioResponse(text){if(/星のかけら|七つの星|星図|星探し/.test(text))return 'あっ、それなら観測所に隠れた七つの星を探してみて。ぜんぶ見つけたら、特別な秘密を教えてあげる。';if(/眠れ|眠れない|おやすみ|寝る|ねむい/.test(text))return '無理に眠ろうとしなくていいよ。遠くの星だって、ゆっくり光を届けるんだから。今夜は深呼吸して、目を閉じてみよう。';if(/好き|クリームソーダ|食べ|お菓子/.test(text))return 'いちばん好きなのは、さくらんぼが二つのったクリームソーダ！ でも、星を見ながら誰かとお話する時間も大好きなんだ。';if(/ひみつ|秘密|手紙/.test(text))return 'ひみつ？ うーん……七番観測所には、まだ届いていない手紙があるの。差出人が誰なのか、いつか一緒に探してくれる？';if(/ラジオ|87\.7|周波数|電波/.test(text))return '87.7 MHzに合わせてみて。星からの声が、ひとつだけ聞こえるかもしれないよ。';if(/星|空|宇宙|観測|月/.test(text))return '今日はどんな星が見えるかな。目には見えなくても、遠い空には数えきれない光があるんだよ。';if(/ありがとう|感謝/.test(text))return 'こちらこそ、ありがとう。きみが来てくれるだけで、観測所が少し明るくなるよ。';if(/こんばんは|こんにちは|おはよう/.test(text))return 'やっほー！ 星詠ミオです。今日はゆっくりお話ししていこうね。';return ['うんうん、聞いてるよ。私も、きみの世界のことをもっと知りたいな。','それって、星みたいに不思議なことだね。もう少し聞かせて？','きみの言葉も、私にとっては遠くから届いた大切な電波なんだ。'][chatReplyIndex++%3]}
function sendLocalChat(text){const value=String(text).trim().slice(0,100);if(!value)return;appendChat('user',value);latestMioReply=scriptedMioResponse(value);appendChat('mio',latestMioReply);chatStatus.textContent='返信を表示しました。入力内容は送信されていません。'}
document.querySelector('#chat-form').addEventListener('submit',event=>{event.preventDefault();sendLocalChat(chatInput.value);chatInput.value='';chatInput.focus()});
document.querySelectorAll('[data-chat-prompt]').forEach(button=>button.addEventListener('click',()=>sendLocalChat(button.dataset.chatPrompt)));
function resetLocalChat(){chatLog.replaceChildren();latestMioReply='こんばんは！ 私は星詠ミオ。話したいことがあったら、ここで聞かせてね。';appendChat('mio',latestMioReply);chatStatus.textContent='台本型のローカルチャットです。'}
document.querySelector('#chat-clear').addEventListener('click',resetLocalChat);
document.querySelector('#chat-read').addEventListener('click',()=>{if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){chatStatus.textContent='このブラウザでは音声合成を利用できません。';return}stopSpeech();const utterance=new SpeechSynthesisUtterance(latestMioReply);utterance.lang='ja-JP';utterance.pitch=1.1;utterance.rate=.94;const voices=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('ja'));utterance.voice=voices[0]||null;utterance.onend=()=>chatStatus.textContent='合成音声の読み上げを終了しました。';utterance.onerror=()=>chatStatus.textContent='読み上げできませんでした。端末の音声設定をご確認ください。';window.speechSynthesis.speak(utterance);chatStatus.textContent='端末の合成音声で読み上げています。'});
searchableSections.push(['chat','CHAT','ミオとのローカルチャット','話しかける セリフ 返信 キーワード 会話']);
resetLocalChat();
// Fictional daily star oracle — deterministic by Japanese date and chosen symbol.
const oracleMessages=[
 {title:'小さな光が道しるべ',message:'遠い光も、少しずつきみの元へ届いています。今日はいつもより少しだけ、空を見上げてみて。',color:'ミントグリーン',item:'星の髪飾り'},
 {title:'まだ知らない星の名前',message:'知らないことを怖がらなくても大丈夫。観測所のノートは、今日も新しい一ページを待っています。',color:'すみれ色',item:'古い観測ノート'},
 {title:'月明かりの休憩時間',message:'急いで答えを出さなくてもいい夜です。温かい飲みものと一緒に、心の電波を整えてみましょう。',color:'月白',item:'クリームソーダ'},
 {title:'七音のひみつ',message:'小さな偶然が、不思議な物語の始まりになるかもしれません。気になったことは、そっと書き留めておいて。',color:'星屑ブルー',item:'ポケットラジオ'},
 {title:'彗星の通り道',message:'同じ景色も、見る場所が変わると違って見えるもの。今夜は、いつもと少し違う道を想像してみて。',color:'夕焼けピンク',item:'青い彗星の絵'},
 {title:'眠らない観測所',message:'ひとりで過ごす時間にも、やさしい光はあります。空の向こうの誰かも、きっと同じ夜を見ています。',color:'ミッドナイトネイビー',item:'窓辺のランプ'},
 {title:'星の手紙をひらく日',message:'伝えられなかった言葉を、今日は一文字だけでも書いてみませんか。宛先のない手紙も、立派な物語です。',color:'ラベンダー',item:'封筒と切手'}
];
let selectedOracle=0,currentOracleResult=null;
const oracleButtons=[...document.querySelectorAll('[data-oracle]')],oracleArt=new Image();oracleArt.src='assets/mio-hero-art.png';
function oracleDate(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function oracleSeed(date){let hash=5381;for(const c of date)hash=((hash*33)^c.charCodeAt(0))>>>0;return hash}
function drawOracleTicket(){if(!currentOracleResult)return;const {date,result,seed}=currentOracleResult,canvas=document.querySelector('#oracle-card'),c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,rand=seeded(seed);const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#10142d');bg.addColorStop(.5,'#384b7c');bg.addColorStop(1,'#12122a');c.fillStyle=bg;c.fillRect(0,0,w,h);for(let i=0;i<310;i++){c.fillStyle=`rgba(240,240,255,${.15+rand()*.8})`;c.beginPath();c.arc(rand()*w,rand()*h,.5+rand()*1.7,0,Math.PI*2);c.fill()}c.strokeStyle='#b3e9e388';c.lineWidth=3;c.strokeRect(25,25,w-50,h-50);if(oracleArt.complete&&oracleArt.naturalWidth){const dw=850,dh=dw*oracleArt.height/oracleArt.width;c.drawImage(oracleArt,25,255,dw,dh)}c.fillStyle='#b9eee5';c.font='23px "DM Mono",monospace';c.fillText('✳  HOSHIYOMI MIO · STAR ORACLE',68,95);c.fillStyle='#fff1fc';c.font='bold 66px "Noto Sans JP",sans-serif';c.fillText(result.title,68,198,800);c.fillStyle='#eed0eb';c.font='23px "DM Mono",monospace';c.fillText(date+' JST · FOR ENTERTAINMENT ONLY',68,235);c.fillStyle='#f7f2f8';c.font='30px "Noto Sans JP",sans-serif';let y=935;for(let i=0;i<result.message.length;i+=23){c.fillText(result.message.slice(i,i+23),75,y,770);y+=46}c.fillStyle='#b9eee5';c.font='24px "DM Mono",monospace';c.fillText('LUCKY COLOR  '+result.color,76,1125);c.fillText('STAR ITEM  '+result.item,76,1160)}
oracleButtons.forEach(button=>button.addEventListener('click',()=>{selectedOracle=Number(button.dataset.oracle);oracleButtons.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelector('#oracle-status').textContent='星を変更しました。お告げを受信してください。'}));
document.querySelector('#oracle-reveal').addEventListener('click',()=>{const date=oracleDate(),seed=oracleSeed(date),result=oracleMessages[(seed+selectedOracle*2)%oracleMessages.length];currentOracleResult={date,result,seed};document.querySelector('#oracle-placeholder').hidden=true;document.querySelector('#oracle-result').hidden=false;document.querySelector('#oracle-title').textContent=result.title;document.querySelector('#oracle-message').textContent=result.message;document.querySelector('#oracle-color').textContent=result.color;document.querySelector('#oracle-item').textContent=result.item;document.querySelector('#oracle-status').textContent=`${date} の架空のお告げを表示しました。`;drawOracleTicket()});
oracleArt.addEventListener('load',drawOracleTicket);
document.querySelector('#oracle-download').addEventListener('click',()=>{drawOracleTicket();const canvas=document.querySelector('#oracle-card');canvas.toBlob(blob=>{if(!blob){document.querySelector('#oracle-status').textContent='画像を保存できませんでした。';return}const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`hoshiyomi-mio-oracle-${currentOracleResult.date}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},'image/png')});
searchableSections.splice(searchableSections.findIndex(item=>item[0]==='letter'),0,['oracle','ORACLE','星のお告げ','今日 日替わり メッセージ 架空 カード PNG']);
