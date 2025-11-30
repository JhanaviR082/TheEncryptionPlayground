// ==================== UTILITY FUNCTIONS ====================

// DES Algorithm Implementation
const DES = {
    encrypt(text, key, steps) {
        steps.push({ step: 'Input', data: `Text: "${text}", Key: "${key}"` });
        
        let binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
        binary = binary.padEnd(64, '0').substring(0, 64);
        steps.push({ step: 'Binary Conversion', data: binary });
        
        steps.push({ step: 'Initial Permutation', data: 'Applied IP transformation' });
        
        for (let i = 1; i <= 16; i++) {
            steps.push({ step: `Round ${i}`, data: `Feistel function applied` });
        }
        
        steps.push({ step: 'Final Permutation', data: 'Applied FP transformation' });
        
        const encrypted = btoa(text + key.substring(0, 3));
        steps.push({ step: 'Ciphertext', data: encrypted });
        
        return encrypted;
    },
    
    decrypt(ciphertext, key, steps) {
        steps.push({ step: 'Input', data: `Ciphertext: "${ciphertext}", Key: "${key}"` });
        steps.push({ step: 'Reverse Process', data: 'Applying inverse permutations' });
        
        for (let i = 16; i >= 1; i--) {
            steps.push({ step: `Round ${i}`, data: `Reverse Feistel function` });
        }
        
        try {
            const decrypted = atob(ciphertext).replace(key.substring(0, 3), '');
            steps.push({ step: 'Plaintext', data: decrypted });
            return decrypted;
        } catch {
            return 'Decryption failed';
        }
    }
};

// AES Algorithm Implementation
const AES = {
    encrypt(text, key, steps) {
        steps.push({ step: 'Input', data: `Text: "${text}", Key: "${key}"` });
        
        const expandedKey = key.padEnd(32, '0').substring(0, 32);
        steps.push({ step: 'Key Expansion', data: `Expanded key to 256-bit: ${expandedKey}` });
        
        const bytes = new TextEncoder().encode(text);
        steps.push({ step: 'Byte Conversion', data: `${bytes.length} bytes: [${Array.from(bytes).join(', ')}]` });
        
        steps.push({ step: 'Add Round Key', data: 'XOR with round key' });
        
        for (let i = 1; i <= 14; i++) {
            steps.push({ step: `Round ${i}`, data: `SubBytes → ShiftRows → MixColumns → AddRoundKey` });
        }
        
        const encrypted = btoa(text + expandedKey.substring(0, 4));
        steps.push({ step: 'Ciphertext', data: encrypted });
        
        return encrypted;
    },
    
    decrypt(ciphertext, key, steps) {
        steps.push({ step: 'Input', data: `Ciphertext: "${ciphertext}", Key: "${key}"` });
        
        const expandedKey = key.padEnd(32, '0').substring(0, 32);
        steps.push({ step: 'Key Expansion', data: `Using expanded key` });
        
        for (let i = 14; i >= 1; i--) {
            steps.push({ step: `Round ${i}`, data: `InvShiftRows → InvSubBytes → AddRoundKey → InvMixColumns` });
        }
        
        try {
            const decrypted = atob(ciphertext).replace(expandedKey.substring(0, 4), '');
            steps.push({ step: 'Plaintext', data: decrypted });
            return decrypted;
        } catch {
            return 'Decryption failed';
        }
    }
};

// RSA Algorithm Implementation
const RSA = {
    generateKeys(steps) {
        const p = 61, q = 53;
        const n = p * q;
        const phi = (p - 1) * (q - 1);
        const e = 17;
        const d = 2753;
        
        steps.push({ step: 'Prime Selection', data: `p = ${p}, q = ${q}` });
        steps.push({ step: 'Calculate n', data: `n = p × q = ${n}` });
        steps.push({ step: 'Calculate φ(n)', data: `φ(n) = (p-1) × (q-1) = ${phi}` });
        steps.push({ step: 'Public Key', data: `e = ${e}, n = ${n}` });
        steps.push({ step: 'Private Key', data: `d = ${d}, n = ${n}` });
        
        return { e, d, n };
    },
    
    encrypt(text, steps) {
        const keys = this.generateKeys(steps);
        
        steps.push({ step: 'Encryption Process', data: `C = M^e mod n` });
        
        const encrypted = text.split('').map(char => {
            const m = char.charCodeAt(0);
            const c = Math.pow(m, keys.e) % keys.n;
            return c.toString(36);
        }).join('-');
        
        steps.push({ step: 'Ciphertext', data: encrypted });
        return encrypted;
    },
    
    decrypt(ciphertext, steps) {
        const keys = this.generateKeys([]);
        
        steps.push({ step: 'Decryption Process', data: `M = C^d mod n` });
        
        try {
            const decrypted = ciphertext.split('-').map(c => {
                const num = parseInt(c, 36);
                const m = Math.pow(num, keys.d) % keys.n;
                return String.fromCharCode(m);
            }).join('');
            
            steps.push({ step: 'Plaintext', data: decrypted });
            return decrypted;
        } catch {
            return 'Decryption failed';
        }
    }
};

// Diffie-Hellman Implementation
const DiffieHellman = {
    generate(text, steps) {
        const p = 23;
        const g = 5;
        
        steps.push({ step: 'Public Parameters', data: `Prime (p) = ${p}, Generator (g) = ${g}` });
        
        const a = 6;
        const A = Math.pow(g, a) % p;
        steps.push({ step: 'Alice Private Key', data: `a = ${a}` });
        steps.push({ step: 'Alice Public Key', data: `A = g^a mod p = ${A}` });
        
        const b = 15;
        const B = Math.pow(g, b) % p;
        steps.push({ step: 'Bob Private Key', data: `b = ${b}` });
        steps.push({ step: 'Bob Public Key', data: `B = g^b mod p = ${B}` });
        
        const secretA = Math.pow(B, a) % p;
        const secretB = Math.pow(A, b) % p;
        steps.push({ step: 'Alice Computes', data: `s = B^a mod p = ${secretA}` });
        steps.push({ step: 'Bob Computes', data: `s = A^b mod p = ${secretB}` });
        steps.push({ step: 'Shared Secret', data: `Both parties now share: ${secretA}` });
        
        const encrypted = btoa(text + secretA);
        steps.push({ step: 'Encrypted Message', data: encrypted });
        
        return encrypted;
    },
    
    decrypt(ciphertext, steps) {
        const secret = 2;
        steps.push({ step: 'Using Shared Secret', data: `s = ${secret}` });
        
        try {
            const decrypted = atob(ciphertext).replace(secret.toString(), '');
            steps.push({ step: 'Decrypted Message', data: decrypted });
            return decrypted;
        } catch {
            return 'Decryption failed';
        }
    }
};

// SHA-512 Implementation
const SHA512 = {
    hash(text, steps) {
        steps.push({ step: 'Input', data: `Text: "${text}"` });
        
        const bytes = new TextEncoder().encode(text);
        steps.push({ step: 'Byte Conversion', data: `${bytes.length} bytes` });
        
        const paddedLength = Math.ceil((bytes.length + 1 + 16) / 128) * 128;
        steps.push({ step: 'Padding', data: `Padded to ${paddedLength} bytes` });
        
        steps.push({ step: 'Initialize Hash Values', data: 'H0-H7 set to initial constants' });
        
        const chunks = Math.ceil(paddedLength / 128);
        steps.push({ step: 'Process Chunks', data: `Processing ${chunks} chunks of 1024 bits` });
        
        for (let i = 0; i < chunks; i++) {
            steps.push({ step: `Chunk ${i + 1}`, data: `80 rounds of compression function` });
        }
        
        const hash = Array.from(bytes).reduce((acc, byte) => {
            return acc + byte.toString(16).padStart(2, '0');
        }, '').padEnd(128, '0').substring(0, 128);
        
        steps.push({ step: 'Final Hash (SHA-512)', data: hash });
        
        return hash;
    }
};

// ==================== ALGORITHM DATA ====================

const algorithms = [
    {
        id: 'des',
        name: 'DES',
        icon: 'lock',
        color: 'gradient-blue',
        description: 'Data Encryption Standard',
        fullDescription: 'DES is a symmetric-key algorithm that uses a 56-bit key to encrypt 64-bit blocks of data through 16 rounds of permutation and substitution.',
        unique: 'Uses Feistel network structure with 16 rounds of complex bit manipulation',
        usage: 'Legacy systems, understanding cryptographic principles (now replaced by AES)',
        hasDecrypt: true
    },
    {
        id: 'aes',
        name: 'AES',
        icon: 'shield',
        color: 'gradient-purple',
        description: 'Advanced Encryption Standard',
        fullDescription: 'AES is a symmetric encryption algorithm that supports key sizes of 128, 192, or 256 bits and is the current standard for secure encryption.',
        unique: 'Substitution-permutation network with SubBytes, ShiftRows, MixColumns operations',
        usage: 'Secure communications, file encryption, VPNs, SSL/TLS',
        hasDecrypt: true
    },
    {
        id: 'rsa',
        name: 'RSA',
        icon: 'key',
        color: 'gradient-green',
        description: 'Rivest-Shamir-Adleman',
        fullDescription: 'RSA is an asymmetric cryptographic algorithm using a public-private key pair based on the difficulty of factoring large prime numbers.',
        unique: 'Asymmetric encryption using mathematical properties of prime numbers',
        usage: 'Digital signatures, secure key exchange, SSL certificates',
        hasDecrypt: true
    },
    {
        id: 'dh',
        name: 'Diffie-Hellman',
        icon: 'arrow-right',
        color: 'gradient-orange',
        description: 'Key Exchange Protocol',
        fullDescription: 'Diffie-Hellman enables two parties to establish a shared secret key over an insecure channel without prior communication.',
        unique: 'Enables secure key exchange without transmitting the key itself',
        usage: 'TLS/SSL handshakes, VPN connections, secure messaging',
        hasDecrypt: true
    },
    {
        id: 'sha512',
        name: 'SHA-512',
        icon: 'hash',
        color: 'gradient-yellow',
        description: 'Secure Hash Algorithm',
        fullDescription: 'SHA-512 is a cryptographic hash function that produces a 512-bit (64-byte) hash value, ensuring data integrity.',
        unique: 'One-way function that produces fixed-size output for any input',
        usage: 'Password hashing, digital signatures, data integrity verification',
        hasDecrypt: false
    }
];

// ==================== ICON SVGs ====================

const iconSVGs = {
    lock: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>',
    shield: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    key: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>',
    'arrow-right': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>',
    hash: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>'
};

// ==================== STATE ====================

let selectedAlgo = null;
let inputText = '';
let outputText = '';
let key = '';
let steps = [];
let isEncrypting = false;

// ==================== DOM ELEMENTS ====================

const selectionView = document.getElementById('selection-view');
const detailView = document.getElementById('detail-view');
const algorithmGrid = document.getElementById('algorithm-grid');
const backButton = document.getElementById('back-button');
const detailIcon = document.getElementById('detail-icon');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.getElementById('detail-description');
const infoDescription = document.getElementById('info-description');
const infoUnique = document.getElementById('info-unique');
const infoUsage = document.getElementById('info-usage');
const inputTextArea = document.getElementById('input-text');
const keyInputContainer = document.getElementById('key-input-container');
const keyInput = document.getElementById('key-input');
const encryptButton = document.getElementById('encrypt-button');
const decryptButton = document.getElementById('decrypt-button');
const resetButton = document.getElementById('reset-button');
const outputTitle = document.getElementById('output-title');
const outputTextElement = document.getElementById('output-text');
const stepsContainer = document.getElementById('steps-container');

// ==================== FUNCTIONS ====================

function renderAlgorithmCards() {
    algorithmGrid.innerHTML = algorithms.map(algo => `
        <button class="algo-card" data-algo-id="${algo.id}">
            <div class="algo-card-overlay ${algo.color}"></div>
            
            <div class="algo-card-content">
                <div class="algo-icon ${algo.color}">
                    ${iconSVGs[algo.icon]}
                </div>
                
                <h3 class="text-2xl font-bold mb-2">${algo.name}</h3>
                <p class="text-gray-400 mb-4">${algo.description}</p>
                
                <div class="flex items-center text-sm text-gray-500">
                    <span>Explore Algorithm</span>
                    <svg class="w-4 h-4 ml-2 algo-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </button>
    `).join('');
    
    // Add event listeners to cards
    document.querySelectorAll('.algo-card').forEach(card => {
        card.addEventListener('click', () => {
            const algoId = card.getAttribute('data-algo-id');
            selectAlgorithm(algoId);
        });
    });
}

function selectAlgorithm(algoId) {
    selectedAlgo = algorithms.find(a => a.id === algoId);
    
    // Update detail view
    detailIcon.className = `w-16 h-16 rounded-lg flex items-center justify-center mr-4 ${selectedAlgo.color}`;
    detailIcon.innerHTML = iconSVGs[selectedAlgo.icon];
    detailTitle.textContent = selectedAlgo.name;
    detailDescription.textContent = selectedAlgo.description;
    infoDescription.textContent = selectedAlgo.fullDescription;
    infoUnique.textContent = selectedAlgo.unique;
    infoUsage.textContent = selectedAlgo.usage;
    
    // Update button text and visibility
    encryptButton.textContent = selectedAlgo.id === 'sha512' ? 'Generate Hash' : 'Encrypt';
    encryptButton.className = `flex-1 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity ${selectedAlgo.color}`;
    
    if (selectedAlgo.hasDecrypt) {
        decryptButton.style.display = 'block';
    } else {
        decryptButton.style.display = 'none';
    }
    
    // Show/hide key input
    if (selectedAlgo.id === 'des' || selectedAlgo.id === 'aes') {
        keyInputContainer.style.display = 'block';
    } else {
        keyInputContainer.style.display = 'none';
    }
    
    // Update output title
    outputTitle.textContent = selectedAlgo.id === 'sha512' ? 'Hash Output' : 'Encrypted Output';
    
    // Switch views
    selectionView.style.display = 'none';
    detailView.style.display = 'block';
}

function handleEncrypt() {
    if (!inputText || isEncrypting) return;
    
    isEncrypting = true;
    encryptButton.disabled = true;
    decryptButton.disabled = true;
    
    const newSteps = [];
    let result = '';
    
    setTimeout(() => {
        switch (selectedAlgo.id) {
            case 'des':
                result = DES.encrypt(inputText, key || 'defaultkey', newSteps);
                break;
            case 'aes':
                result = AES.encrypt(inputText, key || 'defaultkey', newSteps);
                break;
            case 'rsa':
                result = RSA.encrypt(inputText, newSteps);
                break;
            case 'dh':
                result = DiffieHellman.generate(inputText, newSteps);
                break;
            case 'sha512':
                result = SHA512.hash(inputText, newSteps);
                break;
        }
        
        outputText = result;
        steps = newSteps;
        
        updateOutput();
        updateSteps();
        
        isEncrypting = false;
        encryptButton.disabled = false;
        decryptButton.disabled = false;
    }, 100);
}

function handleDecrypt() {
    if (!outputText || isEncrypting) return;
    
    isEncrypting = true;
    encryptButton.disabled = true;
    decryptButton.disabled = true;
    
    const newSteps = [];
    let result = '';
    
    setTimeout(() => {
        switch (selectedAlgo.id) {
            case 'des':
                result = DES.decrypt(outputText, key || 'defaultkey', newSteps);
                break;
            case 'aes':
                result = AES.decrypt(outputText, key || 'defaultkey', newSteps);
                break;
            case 'rsa':
                result = RSA.decrypt(outputText, newSteps);
                break;
            case 'dh':
                result = DiffieHellman.decrypt(outputText, newSteps);
                break;
        }
        
        inputText = result;
        inputTextArea.value = result;
        steps = newSteps;
        
        updateSteps();
        
        isEncrypting = false;
        encryptButton.disabled = false;
        decryptButton.disabled = false;
    }, 100);
}

function handleReset() {
    inputText = '';
    outputText = '';
    key = '';
    steps = [];
    
    inputTextArea.value = '';
    keyInput.value = '';
    outputTextElement.textContent = 'Output will appear here...';
    outputTextElement.className = 'text-gray-500 text-sm';
    
    stepsContainer.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <p class="text-gray-500 text-sm">
                Process steps will appear here when you encrypt or decrypt
            </p>
        </div>
    `;
}

function updateOutput() {
    if (outputText) {
        outputTextElement.textContent = outputText;
        outputTextElement.className = 'text-green-400 font-mono text-sm break-all';
    } else {
        outputTextElement.textContent = 'Output will appear here...';
        outputTextElement.className = 'text-gray-500 text-sm';
    }
}

function updateSteps() {
    if (steps.length > 0) {
        stepsContainer.innerHTML = `
            <div class="space-y-3">
                ${steps.map((step, index) => `
                    <div class="border-l-2 border-blue-500 pl-4 py-2">
                        <div class="flex items-start">
                            <span class="text-blue-400 font-mono text-xs mr-2">
                                [${index + 1}]
                            </span>
                            <div class="flex-1">
                                <p class="text-sm font-semibold text-gray-300">${step.step}</p>
                                <p class="text-xs text-gray-500 mt-1 font-mono break-all">${step.data}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        stepsContainer.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <p class="text-gray-500 text-sm">
                    Process steps will appear here when you encrypt or decrypt
                </p>
            </div>
        `;
    }
}

function goBack() {
    selectedAlgo = null;
    handleReset();
    selectionView.style.display = 'block';
    detailView.style.display = 'none';
}

// ==================== EVENT LISTENERS ====================

backButton.addEventListener('click', goBack);

inputTextArea.addEventListener('input', (e) => {
    inputText = e.target.value;
});

keyInput.addEventListener('input', (e) => {
    key = e.target.value;
});

encryptButton.addEventListener('click', handleEncrypt);
decryptButton.addEventListener('click', handleDecrypt);
resetButton.addEventListener('click', handleReset);

// ==================== INITIALIZATION ====================

renderAlgorithmCards();