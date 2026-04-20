const navbar=document.getElementById('navbar');
const bgAudio=document.getElementById('bgAudio');
const navLinks=document.querySelectorAll('.nav-link');
const pages=document.querySelectorAll('.page');
const playPause=document.getElementById('playPause');
const musicPlayer=document.getElementById('musicPlayer');
const musicToggle=document.getElementById('musicToggle');
const prevTrack=document.getElementById('prevTrack');
const nextTrack=document.getElementById('nextTrack');
const trackProgress=document.getElementById('trackProgress');
const trackCover=document.getElementById('trackCover');
const trackName=document.getElementById('trackName');
const blogList=document.getElementById('blogList');
const blogPost=document.getElementById('blogPost');
const assetPopout=document.getElementById('assetPopout');
const assetToggle=document.getElementById('assetToggle');
const tracks=[
{
name:'nytmp',
src:'assets/audio/nytmp.mp3',
cover:'assets/images/covers/nytmp.webp'
},
{
name:'Ill take care of you (feat. Yebba)',
src:'assets/audio/itcoy.mp3',
cover:'assets/images/covers/itcoy.webp'
},
{
name:'Roses',
src:'assets/audio/roses.mp3',
cover:'assets/images/covers/roses.webp'
},
{
name:'eviction',
src:'assets/audio/eviction.mp3',
cover:'assets/images/covers/eviction.webp'
},
{
name:'RDV (Late Nite Edit)',
src:'assets/audio/rdv.mp3',
cover:'assets/images/covers/rdv.webp'
},
];
let currentTrack=0;
bgAudio.volume=0.62;
function setAudioIcon(icon){
playPause.querySelector('.material-symbols-rounded').textContent=icon;
}
function syncAudioButton(){
setAudioIcon(bgAudio.paused?'play_arrow':'pause');
}
function setProgress(value){
trackProgress.value=value;
trackProgress.style.setProperty('--progress',`${value}%`);
}
function loadTrack(index,playAfterLoad){
currentTrack=(index+tracks.length)%tracks.length;
const track=tracks[currentTrack];
bgAudio.src=track.src;
trackCover.src=track.cover;
trackName.textContent=track.name;
setProgress(0);
if(playAfterLoad){
playCurrentTrack();
}else{
bgAudio.load();
syncAudioButton();
}
}
function playCurrentTrack(){
const playPromise=bgAudio.play();
if(playPromise!==undefined){
playPromise.then(()=>{
syncAudioButton();
}).catch(()=>{
syncAudioButton();
});
}else{
syncAudioButton();
}
}
function goToTrack(direction,forcePlay){
const shouldPlay=forcePlay||!bgAudio.paused;
loadTrack(currentTrack+direction,shouldPlay);
}
syncAudioButton();
window.addEventListener('load',()=>{
navbar.classList.add('show');
const activePage=document.querySelector('.page.active')||pages[0];
activePage.classList.add('active');
});
navLinks.forEach(link=>{
link.addEventListener('click',e=>{
e.preventDefault();
const targetHash=link.getAttribute('href');
const targetId=targetHash.substring(1);
navLinks.forEach(l=>l.classList.remove('active'));
pages.forEach(page=>page.classList.remove('active'));
link.classList.add('active');
setTimeout(()=>{
document.getElementById(targetId).classList.add('active');
},50);
history.replaceState(null,'',targetHash);
});
});
blogList.addEventListener('click',e=>{
const link=e.target.closest('.blog-link');
if(!link){
return;
}
setActiveBlog(link.dataset.blog,true);
});
assetToggle.addEventListener('click',()=>{
assetPopout.classList.toggle('open');
});
musicToggle.addEventListener('click',()=>{
musicPlayer.classList.toggle('open');
});
bgAudio.addEventListener('play',syncAudioButton);
bgAudio.addEventListener('pause',syncAudioButton);
bgAudio.addEventListener('error',syncAudioButton);
bgAudio.addEventListener('loadedmetadata',()=>{
setProgress(0);
});
bgAudio.addEventListener('timeupdate',()=>{
if(Number.isFinite(bgAudio.duration)&&bgAudio.duration>0){
setProgress((bgAudio.currentTime/bgAudio.duration)*100);
}
});
bgAudio.addEventListener('ended',()=>{
goToTrack(1,true);
});
trackProgress.addEventListener('input',()=>{
if(Number.isFinite(bgAudio.duration)&&bgAudio.duration>0){
bgAudio.currentTime=(parseFloat(trackProgress.value)/100)*bgAudio.duration;
setProgress(trackProgress.value);
}
});
prevTrack.addEventListener('click',()=>{
if(bgAudio.currentTime>3){
bgAudio.currentTime=0;
setProgress(0);
return;
}
goToTrack(-1,false);
});
nextTrack.addEventListener('click',()=>{
goToTrack(1,false);
});
playPause.addEventListener('click',()=>{
if(!bgAudio.paused){
bgAudio.pause();
syncAudioButton();
}else{
playCurrentTrack();
}
});
loadTrack(0,false);
function updateClock(){
const now=new Date();
const options={
timeZone:'America/Chicago',
hour:'2-digit',
minute:'2-digit',
second:'2-digit',
hour12:true
};
try{
const time=now.toLocaleTimeString('en-US',options);
document.getElementById('clock').textContent=time;
}catch(e){
const hours=now.getHours();
const minutes=now.getMinutes();
const seconds=now.getSeconds();
const ampm=hours>=12?'PM':'AM';
const displayHours=hours%12||12;
const time=`${displayHours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')} ${ampm}`;
document.getElementById('clock').textContent=time;
}
}
updateClock();
setInterval(updateClock,1000);
function escapeHtml(value){
return value.replace(/[&<>"']/g,character=>{
const entities={
'&':'&amp;',
'<':'&lt;',
'>':'&gt;',
'"':'&quot;',
"'":'&#039;'
};
return entities[character];
});
}
function safeUrl(url){
const trimmed=url.trim();
if(/^(https?:|mailto:|\/|\.\/|\.\.\/|assets\/|blog\/|#)/i.test(trimmed)){
return trimmed;
}
return '#';
}
function normalizeBlogName(name){
return (name||'').toLowerCase().replace(/[^a-z0-9_-]/g,'');
}
function setActiveBlog(name,updateHash){
const normalized=normalizeBlogName(name);
if(!normalized){
return;
}
let selected=[...document.querySelectorAll('.blog-link')].find(link=>link.dataset.blog===normalized);
if(!selected){
selected=document.createElement('button');
selected.className='blog-link';
selected.dataset.blog=normalized;
selected.textContent=normalized;
blogList.appendChild(selected);
}
document.querySelectorAll('.blog-link').forEach(link=>link.classList.remove('active'));
selected.classList.add('active');
loadBlog(normalized);
if(updateHash&&document.getElementById('blog').classList.contains('active')){
history.replaceState(null,'',`#blog/${normalized}`);
}
}
function renderInline(value){
const stash=[];
const keep=html=>{
const index=stash.push(html)-1;
return `\uE000${index}\uE001`;
};
let text=value.replace(/`([^`]+)`/g,(match,code)=>keep(`<code>${escapeHtml(code)}</code>`));
text=text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(match,alt,url)=>keep(`<img src="${escapeHtml(safeUrl(url))}" alt="${escapeHtml(alt)}">`));
text=text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,(match,label,url)=>keep(`<a href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`));
text=escapeHtml(text);
text=text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
text=text.replace(/__([^_]+)__/g,'<strong>$1</strong>');
text=text.replace(/\*([^*]+)\*/g,'<em>$1</em>');
text=text.replace(/_([^_]+)_/g,'<em>$1</em>');
text=text.replace(/~~([^~]+)~~/g,'<del>$1</del>');
return text.replace(/\uE000(\d+)\uE001/g,(match,index)=>stash[Number(index)]||'');
}
function renderMarkdown(markdown){
const lines=markdown.replace(/\r\n/g,'\n').split('\n');
let html='';
let paragraph=[];
let listType='';
let inCode=false;
let code=[];
const flushParagraph=()=>{
if(paragraph.length){
html+=`<p>${renderInline(paragraph.join(' '))}</p>`;
paragraph=[];
}
};
const closeList=()=>{
if(listType){
html+=`</${listType}>`;
listType='';
}
};
const openList=type=>{
if(listType!==type){
closeList();
html+=`<${type}>`;
listType=type;
}
};
lines.forEach(line=>{
if(line.trim().startsWith('```')){
if(inCode){
html+=`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`;
code=[];
inCode=false;
}else{
flushParagraph();
closeList();
inCode=true;
}
return;
}
if(inCode){
code.push(line);
return;
}
const trimmed=line.trim();
if(!trimmed){
flushParagraph();
closeList();
return;
}
const heading=trimmed.match(/^(#{1,3})\s+(.+)$/);
if(heading){
flushParagraph();
closeList();
const level=heading[1].length;
html+=`<h${level}>${renderInline(heading[2])}</h${level}>`;
return;
}
if(/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)){
flushParagraph();
closeList();
html+='<hr>';
return;
}
const quote=trimmed.match(/^>\s?(.*)$/);
if(quote){
flushParagraph();
closeList();
html+=`<blockquote>${renderInline(quote[1])}</blockquote>`;
return;
}
const unordered=trimmed.match(/^[-*+]\s+(.+)$/);
if(unordered){
flushParagraph();
openList('ul');
html+=`<li>${renderInline(unordered[1])}</li>`;
return;
}
const ordered=trimmed.match(/^\d+\.\s+(.+)$/);
if(ordered){
flushParagraph();
openList('ol');
html+=`<li>${renderInline(ordered[1])}</li>`;
return;
}
paragraph.push(trimmed);
});
if(inCode){
html+=`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`;
}
flushParagraph();
closeList();
return html;
}
function loadBlog(name){
blogPost.className='blog-post markdown-body loading';
blogPost.textContent='loading...';
fetch(`blog/${name}.txt`,{cache:'no-cache'}).then(response=>{
if(!response.ok){
throw new Error('missing');
}
return response.text();
}).then(text=>{
const trimmed=text.trim();
if(!trimmed){
blogPost.className='blog-post markdown-body empty';
blogPost.textContent='this blog post is empty right now.';
return;
}
blogPost.className='blog-post markdown-body';
blogPost.innerHTML=renderMarkdown(trimmed);
}).catch(()=>{
blogPost.className='blog-post markdown-body error';
blogPost.textContent='could not load this blog post.';
});
}
const hashParts=window.location.hash.replace('#','').split('/');
const currentHash=hashParts[0];
const requestedBlog=normalizeBlogName(hashParts[1]);
if(currentHash){
const matchingNav=document.querySelector(`.nav-link[href="#${currentHash}"]`);
const matchingPage=document.getElementById(currentHash);
if(matchingNav&&matchingPage){
navLinks.forEach(link=>link.classList.remove('active'));
pages.forEach(page=>page.classList.remove('active'));
matchingNav.classList.add('active');
matchingPage.classList.add('active');
}
}
setActiveBlog(requestedBlog||document.querySelector('.blog-link.active').dataset.blog,false);
