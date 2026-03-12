const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const clearBtn = document.getElementById('clear-chat');
const themeBtn = document.getElementById('toggle-theme');

// Knowledge Base
const knowledgeBase = {
    "about": {
        "keywords": ["ncc", "what is", "about"],
        "response": "The National Cadet Corps (NCC) is the youth wing of the Indian Armed Forces. It is a tri-service organization, comprising the Army, the Navy and the Air Force, engaged in grooming the youth of the country into disciplined and patriotic citizens."
    },
    "join": {
        "keywords": ["join", "enroll", "become a cadet"],
        "response": "To join the NCC, you must be a student in a school or college. There are two wings: Junior Division (Class 8-10) and Senior Division (College/Uni). Contact your school's NCC officer (ANO) or visit the nearest NCC unit!"
    },
    "certificates": {
        "keywords": ["certificate", "a-certificate", "b-certificate", "c-certificate", "benefits"],
        "response": "NCC offers three certificates: A (School), B (Senior Wing), and C (Highest). Benefits include: \n- Special entry in Indian Armed Forces (no UPSC exam for C cert).\n- Bonus marks in CAPF, Police, and several Govt jobs.\n- Preference in state services and many private companies."
    },
    "camps": {
        "keywords": ["camp", "rdc", "catc", "tsc", "alcts", "types of camps"],
        "response": "NCC is known for its camps! Key ones include:\n- **RDC (Republic Day Camp):** The most prestigious.\n- **CATC (Combined Annual Training Camp):** Mandatory for all.\n- **TSC (Thal Sainik Camp):** Focused on army subjects.\n- **National Integration Camps (NIC):** Promoting unity across India."
    },
    "motto": {
        "keywords": ["motto", "aim"],
        "response": "The motto of NCC is **'Unity and Discipline'** (Ekta aur Anushasan). It aims to develop character, comradeship, and the ideal of selfless service among young citizens."
    },
    "training": {
        "keywords": ["training", "drill", "shooting", "subjects"],
        "response": "NCC training includes drill, weapon training (SLR, Point 22), map reading, field craft, first aid, and social service activities. It prepares you physically and mentally for service to the nation."
    },
    "ranks": {
        "keywords": ["rank", "promotion", "cadet rank", "suo", "juo"],
        "response": "NCC has a ranking system similar to the military. Ranks include:\n- **JD/JW:** L/Cpl, Cpl, Sgt, Troop Leader.\n- **SD/SW:** Cpl, Sgt, UO (Under Officer), SUO (Senior Under Officer)."
    },
    "organization": {
        "keywords": ["organization", "headquarter", "dg ncc", "directorate"],
        "response": "NCC is headed by a Director General (DG) of the rank of Lieutenant General. It has 17 Directorates across India, divided into Groups and then Units."
    },
    "eligibility": {
        "keywords": ["eligible", "age", "criteria", "who can join"],
        "response": "Eligibility for NCC:\n- **Citizen of India** or Nepal.\n- **Junior Division:** Age 12-18.5 years.\n- **Senior Division:** Up to 26 years (students in college).\n- **Medical Fitness:** Must be physically fit as per military standards."
    },
    "a-certificate": {
        "keywords": ["a certificate", "a cert"],
        "response": "A-Certificate is for Junior Division cadets (School). It requires 2 years of training and attendance at one camp. It gives bonus marks in some state police recruitments."
    }
};

const defaultResponse = "That's an interesting question! I don't have the specific details on that right now, but I recommend checking the official NCC India website or asking your Unit ANO. Would you like to know about Certificates or How to Join?";

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot-message typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
        <div class="bubble">
            <span class="dot-blink"></span>
            <span class="dot-blink"></span>
            <span class="dot-blink"></span>
        </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function addMessage(text, isBot = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    
    // Convert newlines to breaks for bot messages
    const formattedText = isBot ? text.replace(/\n/g, '<br>') : text;

    messageDiv.innerHTML = `
        <div class="bubble">
            ${formattedText}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processInput(input) {
    const lowerInput = input.toLowerCase();
    let bestMatch = null;

    for (const category in knowledgeBase) {
        if (knowledgeBase[category].keywords.some(keyword => lowerInput.includes(keyword))) {
            bestMatch = knowledgeBase[category].response;
            break;
        }
    }

    return bestMatch || defaultResponse;
}

function sendMessage(text) {
    if (!text) return;
    
    addMessage(text, false);
    userInput.value = '';

    // Show typing, wait, then respond
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const response = processInput(text);
        addMessage(response, true);
    }, 1200);
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(userInput.value.trim());
});

clearBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    addMessage("Jai Hind! Chat history cleared. How can I help you again?", true);
});

themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Expose sendMessage to window for suggestions
window.sendMessage = sendMessage;
window.setContext = (topic) => {
    const response = knowledgeBase[topic]?.response;
    if (response) {
        addMessage(`Tell me about ${topic.charAt(0).toUpperCase() + topic.slice(1)}`, false);
        setTimeout(() => addMessage(response, true), 500);
    }
};
