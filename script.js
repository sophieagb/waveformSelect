document.addEventListener("DOMContentLoaded", function(event) {

const envelope = document.getElementById('envelope');
const controlsCard = document.getElementById('controlsCard');
const closeBtn = document.getElementById('closeBtn');
const cupidContainer = document.getElementById('cupidContainer');

function shootArrow() {
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.textContent = '🏹';
    
    const startY = Math.random() * 40 + 30; // 30-70% from top
    arrow.style.top = startY + '%';
    
    cupidContainer.appendChild(arrow);
    
    setTimeout(() => {
        arrow.remove();
    }, 2000);
}

let synthParams = {
    additiveMix: 0.9,
    amMix: 0.1,
    fmMix: 0.1,
    numPartials: 4,
    amModFreq: 8,
    amModDepth: 0.5,
    fmRatio: 2.0,
    fmModDepth: 100,
    lfoFreq: 5,
    lfoDepth: 10,
    attackTime: 0.01,
    decayTime: 0.1,
    sustainLevel: 0.7,
    releaseTime: 0.3
};

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    controlsCard.classList.add('open');
    
    shootArrow();
    
    setTimeout(() => shootArrow(), 200);
});

closeBtn.addEventListener('click', () => {
    envelope.classList.remove('open');
    controlsCard.classList.remove('open');
});

function setupControls() {
    document.getElementById('additiveMix').addEventListener('input', (e) => {
        synthParams.additiveMix = parseFloat(e.target.value);
        document.getElementById('additiveMixValue').textContent = e.target.value;
    });

    document.getElementById('amMix').addEventListener('input', (e) => {
        synthParams.amMix = parseFloat(e.target.value);
        document.getElementById('amMixValue').textContent = e.target.value;
    });

    document.getElementById('fmMix').addEventListener('input', (e) => {
        synthParams.fmMix = parseFloat(e.target.value);
        document.getElementById('fmMixValue').textContent = e.target.value;
    });

    document.getElementById('numPartials').addEventListener('input', (e) => {
        synthParams.numPartials = parseInt(e.target.value);
        document.getElementById('numPartialsValue').textContent = e.target.value;
    });

    document.getElementById('amModFreq').addEventListener('input', (e) => {
        synthParams.amModFreq = parseFloat(e.target.value);
        document.getElementById('amModFreqValue').textContent = e.target.value;
    });

    document.getElementById('amModDepth').addEventListener('input', (e) => {
        synthParams.amModDepth = parseFloat(e.target.value);
        document.getElementById('amModDepthValue').textContent = e.target.value;
    });

    document.getElementById('fmRatio').addEventListener('input', (e) => {
        synthParams.fmRatio = parseFloat(e.target.value);
        document.getElementById('fmRatioValue').textContent = e.target.value;
    });

    document.getElementById('fmModDepth').addEventListener('input', (e) => {
        synthParams.fmModDepth = parseFloat(e.target.value);
        document.getElementById('fmModDepthValue').textContent = e.target.value;
    });

    document.getElementById('lfoFreq').addEventListener('input', (e) => {
        synthParams.lfoFreq = parseFloat(e.target.value);
        document.getElementById('lfoFreqValue').textContent = e.target.value;
    });

    document.getElementById('lfoDepth').addEventListener('input', (e) => {
        synthParams.lfoDepth = parseFloat(e.target.value);
        document.getElementById('lfoDepthValue').textContent = e.target.value;
    });

    document.getElementById('attackTime').addEventListener('input', (e) => {
        synthParams.attackTime = parseFloat(e.target.value);
        document.getElementById('attackTimeValue').textContent = e.target.value;
    });

    document.getElementById('decayTime').addEventListener('input', (e) => {
        synthParams.decayTime = parseFloat(e.target.value);
        document.getElementById('decayTimeValue').textContent = e.target.value;
    });

    document.getElementById('sustainLevel').addEventListener('input', (e) => {
        synthParams.sustainLevel = parseFloat(e.target.value);
        document.getElementById('sustainLevelValue').textContent = e.target.value;
    });

    document.getElementById('releaseTime').addEventListener('input', (e) => {
        synthParams.releaseTime = parseFloat(e.target.value);
        document.getElementById('releaseTimeValue').textContent = e.target.value;
    });
}

setupControls();

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
    { note: 'Y', freq: 880.00, type: 'white', pos: 744 },
    { note: '7', freq: 932.33, type: 'black', pos: 786 },
    { note: 'U', freq: 987.77, type: 'white', pos: 806 }
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

function playNote(frequency, element, noteKey) {
    const now = audioContext.currentTime;
    const allOscillators = [];
    const allGainNodes = [];
    
    // NOW USING synthParams instead of hardcoded values!
    const additiveMix = synthParams.additiveMix;
    const amMix = synthParams.amMix;
    const fmMix = synthParams.fmMix;
    
    // ADDITIVE SYNTHESIS WITH DYNAMIC PARTIALS
    if (additiveMix > 0) {
        const additiveGain = audioContext.createGain();
        additiveGain.gain.setValueAtTime(additiveMix, now);
        
        // CREATE ONE LFO FOR ALL ADDITIVE PARTIALS
        const lfo = audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(synthParams.lfoFreq, now);  // Using synthParams!
        
        const lfoGain = audioContext.createGain();
        lfoGain.gain.setValueAtTime(synthParams.lfoDepth, now);  // Using synthParams!
        
        lfo.connect(lfoGain);
        lfo.start();
        allOscillators.push(lfo);
        
        // Generate partials based on numPartials parameter
        for (let i = 0; i < synthParams.numPartials; i++) {
            const harmonic = 2 * i + 1; // odd harmonics: 1, 3, 5, 7...
            const amplitude = 0.4 / (i + 1); // decreasing amplitude
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency * harmonic, now);
            
            // Connect the LFO to THIS oscillator's frequency
            lfoGain.connect(osc.frequency);
            
            // ADSR envelope using synthParams
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(amplitude, now + synthParams.attackTime);
            gain.gain.linearRampToValueAtTime(amplitude * synthParams.sustainLevel, now + synthParams.attackTime + synthParams.decayTime);
            
            osc.connect(gain);
            gain.connect(additiveGain);
            osc.start();
            
            allOscillators.push(osc);
            allGainNodes.push(gain);
        }
        
        additiveGain.connect(globalGain);
        allGainNodes.push(additiveGain);
    }
    
    // AMPLITUDE MODULATION using synthParams
    if (amMix > 0) {
        const carrier = audioContext.createOscillator();
        const modulator = audioContext.createOscillator();
        const modulationGain = audioContext.createGain();
        const carrierGain = audioContext.createGain();  
        const amOutputGain = audioContext.createGain();
        
        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(frequency, now);
        
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(synthParams.amModFreq, now);  // Using synthParams!
        
        modulationGain.gain.setValueAtTime(synthParams.amModDepth, now);  // Using synthParams!
        carrierGain.gain.setValueAtTime(1, now);
        amOutputGain.gain.setValueAtTime(amMix, now);
        
        modulator.connect(modulationGain);
        modulationGain.connect(carrierGain.gain); 
        
        carrier.connect(carrierGain);
        carrierGain.connect(amOutputGain);
        amOutputGain.connect(globalGain);
        
        carrier.start();
        modulator.start();
        
        allOscillators.push(carrier, modulator);
        allGainNodes.push(carrierGain, amOutputGain);
    }
    
    // FREQUENCY MODULATION using synthParams
    if (fmMix > 0) {
        const carrier = audioContext.createOscillator();
        const modulator = audioContext.createOscillator();
        const modulationGain = audioContext.createGain();
        const fmOutputGain = audioContext.createGain();
        
        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(frequency, now);
        
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(frequency * synthParams.fmRatio, now); // Using synthParams!
        
        modulationGain.gain.setValueAtTime(synthParams.fmModDepth, now); // Using synthParams!
        fmOutputGain.gain.setValueAtTime(fmMix, now);
        
        modulator.connect(modulationGain);
        modulationGain.connect(carrier.frequency);
        
        carrier.connect(fmOutputGain);
        fmOutputGain.connect(globalGain);
        
        carrier.start();
        modulator.start();
        
        allOscillators.push(carrier, modulator);
        allGainNodes.push(fmOutputGain);
    }
    
    activeOscillators[noteKey] = { 
        oscillators: allOscillators,
        gainNodes: allGainNodes
    };
    
    if (element) element.classList.add('active');
    createHeart();
    changeBackgroundColor();
}

function stopNote(noteKey) {
    if (activeOscillators[noteKey]) {
        const { oscillators, gainNodes } = activeOscillators[noteKey];
        const now = audioContext.currentTime;
        
        // Apply release envelope using synthParams
        gainNodes.forEach((gainNode, index) => {
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + synthParams.releaseTime);
            
            oscillators[index].stop(now + synthParams.releaseTime);
        });
                
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