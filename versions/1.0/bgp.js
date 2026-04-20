const navbar=document.getElementById('navbar');
const bgAudio=document.getElementById('bgAudio');
const navLinks=document.querySelectorAll('.nav-link');
const pages=document.querySelectorAll('.page');
const volume=document.getElementById('volume');
const playPause=document.getElementById('playPause');
let isPlaying=false;
bgAudio.volume=parseFloat(volume.value);
window.addEventListener('load',()=>{
navbar.classList.add('show');
pages[0].classList.add('active');
});
navLinks.forEach(link=>{
link.addEventListener('click',e=>{
e.preventDefault();
const targetId=link.getAttribute('href').substring(1);
navLinks.forEach(l=>l.classList.remove('active'));
pages.forEach(page=>page.classList.remove('active'));
link.classList.add('active');
setTimeout(()=>{
document.getElementById(targetId).classList.add('active');
},50);
});
});
volume.addEventListener('input',()=>{
bgAudio.volume=parseFloat(volume.value);
});
volume.addEventListener('change',()=>{
bgAudio.volume=parseFloat(volume.value);
});
playPause.addEventListener('click',()=>{
if(isPlaying){
bgAudio.pause();
playPause.innerHTML='<span class="material-symbols-rounded">play_arrow</span>';
isPlaying=false;
}else{
const playPromise=bgAudio.play();
if(playPromise!==undefined){
playPromise.then(()=>{
playPause.innerHTML='<span class="material-symbols-rounded">pause</span>';
isPlaying=true;
}).catch(()=>{
console.log('Playback prevented');
});
}
}
});
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