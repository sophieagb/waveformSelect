document.addEventListener("DOMContentLoaded", function(event) {

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const globalGain = audioContext.createGain();
globalGain.gain.setValueAtTime(0.3, audioContext.currentTime); 
globalGain.connect(audioContext.destination);

const activeOscillators = {};

const keys = [
    { note: 'Z', freq: 261.63, type: 'white', pos: 0 },     
    { note: 'S', freq: 277.18, type: 'black', pos: 42 },     
    { note: 'X', freq: 293.66, type: 'white', pos: 62 },     
    { note: 'D', freq: 311.13, type: 'black', pos: 104 },   
    { note: 'C', freq: 329.63, type: 'white', pos: 124 },    
    { note: 'V', freq: 349.23, type: 'white', pos: 186 },    
    { note: 'G', freq: 369.99, type: 'black', pos: 228 },    
    { note: 'B', freq: 392.00, type: 'white', pos: 248 },    
    { note: 'H', freq: 415.30, type: 'black', pos: 290 },    
    { note: 'N', freq: 440.00, type: 'white', pos: 310 },    
    { note: 'J', freq: 466.16, type: 'black', pos: 352 },    
    { note: 'M', freq: 493.88, type: 'white', pos: 372 },    
    { note: 'Q', freq: 523.25, type: 'white', pos: 434 },   
    { note: '2', freq: 554.37, type: 'black', pos: 476 },    
    { note: 'W', freq: 587.33, type: 'white', pos: 496 },    
    { note: '3', freq: 622.25, type: 'black', pos: 538 },    
    { note: 'E', freq: 659.25, type: 'white', pos: 558 },    
    { note: 'R', freq: 698.46, type: 'white', pos: 620 },    
    { note: '5', freq: 739.99, type: 'black', pos: 662 },    
    { note: 'T', freq: 783.99, type: 'white', pos: 682 },    
    { note: '6', freq: 830.61, type: 'black', pos: 724 },    
    { note: 'Y', freq: 880.00, type: 'white', pos: 744 }     
];

const keyboard = document.getElementById('keyboard');
const waveformSelect = document.getElementById('waveformSelect');
const heartsContainer = document.getElementById('heartsContainer');

keys.forEach(key => {
    const keyElement = document.createElement('div');
    keyElement.className = `key ${key.type}`;
    keyElement.style.left = key.pos + 'px';
    keyElement.textContent = key.note;
    keyElement.dataset.freq = key.freq;
    keyElement.dataset.note = key.note;
    
    keyElement.addEventListener('mousedown', () => {
        if (!activeOscillators[key.note]) {
            playNote(key.freq, keyElement, key.note);
        }
    });
    keyElement.addEventListener('mouseup', () => stopNote(key.note));
    keyElement.addEventListener('mouseleave', () => stopNote(key.note));
    
    keyboard.appendChild(keyElement);
});

const maxPos = Math.max(...keys.map(k => k.pos));
keyboard.style.width = (maxPos + 62) + 'px';

const keyMap = {};
keys.forEach(key => {
    keyMap[key.note.toLowerCase()] = { 
        freq: key.freq, 
        element: document.querySelector(`[data-note="${key.note}"]`),
        note: key.note
    };
});

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key] && !e.repeat && !activeOscillators[keyMap[key].note]) {
        playNote(keyMap[key].freq, keyMap[key].element, keyMap[key].note);
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keyMap[key]) {
        stopNote(keyMap[key].note);
    }
});

const attackTime = 0.01;
const decayTime = 0.1;
const sustainLevel = 0.7;
const releaseTime = 0.3;

function playNote(frequency, element, noteKey) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = waveformSelect.value;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(globalGain);
    
    oscillator.start();
    
    activeOscillators[noteKey] = { oscillator, gainNode };
    
    if (element) {
        element.classList.add('active');
    }
    
    createHeart();
    changeBackgroundColor();
}

function stopNote(noteKey) {
    if (activeOscillators[noteKey]) {
        const { oscillator, gainNode } = activeOscillators[noteKey];
        const now = audioContext.currentTime;
        
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + releaseTime);
        
        oscillator.stop(now + releaseTime);
        
        delete activeOscillators[noteKey];
    }
    
    const elements = document.querySelectorAll(`[data-note="${noteKey}"]`);
    elements.forEach(el => el.classList.remove('active'));
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + '%';
    const size = Math.random() * 20 + 20;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

let colorIndex = 0;
function changeBackgroundColor() {
    document.body.className = `color-change-${(colorIndex % 4) + 1}`;
    colorIndex++;
}

});