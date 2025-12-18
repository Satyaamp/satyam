const chatData = {
    "start": {
        msg: "Hi! I'm Satyam's virtual assistant. What would you like to know?",
        options: [
            { text: "About Satyam", next: "about" },
            { text: "Skills & Tech", next: "skills" },
            { text: "Projects", next: "projects" },
            { text: "Contact Info", next: "contact" }
        ]
    },
    "about": {
        msg: "Satyam is a Full Stack Developer and AI enthusiast pursuing B.Tech in AI at Parul University (CGPA: 8.05). He loves building scalable web apps.",
        options: [
            { text: "Education Details", next: "education" },
            { text: "Back to Menu", next: "start" }
        ]
    },
    "education": {
        msg: "• B.Tech in AI (2022-Present) - Parul University\n• 12th Grade (2021) - 74.8%\n• 10th Grade (2019) - 88.8%",
        options: [
            { text: "Back to Menu", next: "start" }
        ]
    },
    "skills": {
        msg: "Satyam specializes in:\n• Backend: Node.js, Express.js, Python (Flask)\n• Database: MongoDB, SQLite\n• Frontend: HTML/CSS, JS, Angular\n• Tools: Git, Postman",
        options: [
            { text: "See Projects", next: "projects" },
            { text: "Back to Menu", next: "start" }
        ]
    },
    "projects": {
        msg: "Here are some key projects:\n1. ProductiveMe (Task Manager)\n2. DhanRekhaa (Expense Tracker)\n3. ReBazaar (Marketplace)\n4. COVID-19 Analysis",
        options: [
            { text: "ProductiveMe Details", next: "proj_productive" },
            { text: "DhanRekhaa Details", next: "proj_dhan" },
            { text: "Back to Menu", next: "start" }
        ]
    },

    "proj_productive": {
        msg: "ProductiveMe is a task manager with JWT auth and CRUD operations.\n\nhttps://productivemee.netlify.app/\n\nTest Creds: satyamin@zohomail.in / Satyam@1234",
        options: [
            { text: "DhanRekha Details", next: "proj_dhan"},
            { text: "Back to Projects", next: "projects" },
            { text: "Back to Menu", next: "start" }
        ]
    },
    
    "proj_dhan": {
        msg: "DhanRekhaa is an expense tracker with secure auth and categorization.\n\nhttps://dhanrekhaa.netlify.app/\n\nTest Creds: abc@gmail.com / 1234",
        options: [
            { text: "ProductiveMe Details", next: "proj_productive" },
            { text: "Back to Projects", next: "projects" },
            { text: "Back to Menu", next: "start" }
        ]
    },

    "contact": {
        msg: "You can reach Satyam at:\nEmail: cbse821@gmail.com\nPhone: +91-7488253867\nLinkedIn: linkedin.com/in/satyaamp",
        options: [
            { text: "Download vCard", action: "downloadVCard" },
            { text: "Back to Menu", next: "start" }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const chatFab = document.getElementById('chat-fab');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');
    const chatHeader = document.querySelector('.chat-header');

    let isChatOpen = false;

    // Toggle Chat
    chatFab.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        chatContainer.style.display = isChatOpen ? 'flex' : 'none';
        if (isChatOpen && messagesContainer.children.length === 0) {
            loadConversation('start');
        }
    });

    closeChat.addEventListener('click', () => {
        isChatOpen = false;
        chatContainer.style.display = 'none';
    });

    // Draggable Chat Logic
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    chatHeader.addEventListener('mousedown', (e) => {
        if (e.target === closeChat) return; // Don't drag if clicking close button
        isDragging = true;
        const rect = chatContainer.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        chatHeader.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        chatContainer.style.left = (e.clientX - dragOffsetX) + 'px';
        chatContainer.style.top = (e.clientY - dragOffsetY) + 'px';
        chatContainer.style.bottom = 'auto';
        chatContainer.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        chatHeader.style.cursor = 'move';
    });

    function linkify(text) {
        let replacedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #06ffa5; text-decoration: underline;">$1</a>');
        replacedText = replacedText.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g, '<a href="mailto:$1" style="color: #06ffa5; text-decoration: underline;">$1</a>');
        replacedText = replacedText.replace(/(\+91-\d{10})/g, '<a href="tel:$1" style="color: #06ffa5; text-decoration: underline;">$1</a>');
        replacedText = replacedText.replace(/(^|\s)(linkedin\.com\/[^\s]+)/g, '$1<a href="https://$2" target="_blank" style="color: #06ffa5; text-decoration: underline;">$2</a>');
        return replacedText.replace(/\n/g, '<br>');
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;
        div.innerHTML = linkify(text);
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'typing-indicator';
        div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function loadConversation(key) {
        const data = chatData[key];
        if (!data) return;

        // Clear options immediately
        optionsContainer.innerHTML = '';
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            // Add bot message
            addMessage(data.msg, 'bot');

            if (data.options) {
                data.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'chat-option-btn';
                    btn.innerText = opt.text;
                    btn.onclick = () => {
                        addMessage(opt.text, 'user');
                        if (opt.action === 'downloadVCard') {
                            if (typeof downloadVCard === 'function') downloadVCard();
                        } else if (opt.next) {
                            loadConversation(opt.next);
                        }
                    };
                    optionsContainer.appendChild(btn);
                });
            }
        }, 1000);
    }
});