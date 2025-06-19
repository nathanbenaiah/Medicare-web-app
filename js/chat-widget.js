// MediCare+ Chat Widget - Floating AI Assistant
// This can be embedded on any page by including this script

(function() {
    'use strict';

    // Create CSS styles for the widget
    const widgetCSS = `
        .medicare-chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        }

        .medicare-chat-toggle {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            transition: all 0.3s ease;
            border: none;
            position: relative;
            animation: medicareWidgetPulse 2s infinite;
        }

        @keyframes medicareWidgetPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .medicare-chat-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 123, 255, 0.4);
        }

        .medicare-chat-toggle.active {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            animation: none;
        }

        .medicare-notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #28a745;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .medicare-chat-container {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .medicare-chat-container.active {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
        }

        .medicare-chat-header {
            background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 15px 15px 0 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .medicare-status-dot {
            width: 8px;
            height: 8px;
            background: #28a745;
            border-radius: 50%;
            animation: medicareStatusPulse 2s infinite;
        }

        @keyframes medicareStatusPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .medicare-status-dot.offline {
            background: #dc3545;
        }

        .medicare-chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: linear-gradient(135deg, #f8fafc 0%, white 100%);
        }

        .medicare-widget-message {
            margin-bottom: 15px;
            display: flex;
            gap: 10px;
        }

        .medicare-widget-message.user {
            justify-content: flex-end;
        }

        .medicare-message-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
        }

        .medicare-widget-message.user .medicare-message-avatar {
            background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
            color: white;
        }

        .medicare-widget-message.ai .medicare-message-avatar {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }

        .medicare-message-content {
            max-width: 250px;
            padding: 10px 15px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        .medicare-widget-message.user .medicare-message-content {
            background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
            color: white;
            border-bottom-right-radius: 5px;
        }

        .medicare-widget-message.ai .medicare-message-content {
            background: #f1f3f4;
            color: #333;
            border-bottom-left-radius: 5px;
        }

        .medicare-chat-input-area {
            padding: 15px;
            border-top: 1px solid #e9ecef;
            border-radius: 0 0 15px 15px;
            background: white;
        }

        .medicare-disclaimer {
            background: #fff3cd;
            border-left: 4px solid #f0ad4e;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            font-size: 11px;
            color: #856404;
        }

        .medicare-input-row {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .medicare-chat-input {
            flex: 1;
            padding: 10px 15px;
            border: 2px solid #e9ecef;
            border-radius: 20px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .medicare-chat-input:focus {
            border-color: #007BFF;
        }

        .medicare-send-btn {
            width: 35px;
            height: 35px;
            background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .medicare-send-btn:hover {
            transform: scale(1.1);
        }

        .medicare-send-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
        }

        .medicare-quick-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
        }

        .medicare-suggestion-btn {
            background: #e9ecef;
            border: none;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            cursor: pointer;
            color: #495057;
            transition: all 0.3s ease;
        }

        .medicare-suggestion-btn:hover {
            background: #007BFF;
            color: white;
        }

        .medicare-typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 10px 15px;
            background: #f1f3f4;
            border-radius: 18px;
            margin-bottom: 15px;
        }

        .medicare-typing-dots {
            display: flex;
            gap: 3px;
        }

        .medicare-typing-dot {
            width: 4px;
            height: 4px;
            background: #6c757d;
            border-radius: 50%;
            animation: medicareTyping 1.5s infinite;
        }

        .medicare-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .medicare-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes medicareTyping {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }

        @media (max-width: 768px) {
            .medicare-chat-widget {
                bottom: 10px;
                right: 10px;
            }
            
            .medicare-chat-container {
                width: 320px;
                height: 450px;
                bottom: 70px;
            }
        }

        .medicare-chat-messages::-webkit-scrollbar {
            width: 4px;
        }

        .medicare-chat-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .medicare-chat-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 2px;
        }
    `;

    // MediCare+ Chat Widget Class
    class MediCareChatWidget {
        constructor() {
            this.isOpen = false;
            this.isTyping = false;
            this.messageHistory = [];
            this.init();
        }

        init() {
            this.injectCSS();
            this.createWidget();
            this.setupEventListeners();
            this.testConnection();
        }

        injectCSS() {
            const style = document.createElement('style');
            style.textContent = widgetCSS;
            document.head.appendChild(style);
        }

        createWidget() {
            const widgetHTML = `
                <div class="medicare-chat-widget" id="medicareChatWidget">
                    <button class="medicare-chat-toggle" id="medicareChatToggle">
                        <i class="fas fa-comments" id="medicareChatIcon"></i>
                        <div class="medicare-notification-badge" id="medicareNotificationBadge" style="display: none;">1</div>
                    </button>

                    <div class="medicare-chat-container" id="medicareChatContainer">
                        <div class="medicare-chat-header">
                            <div class="medicare-status-dot" id="medicareStatusDot"></div>
                            <div>
                                <div style="font-weight: 600;">MediCare+ AI Assistant</div>
                                <div style="font-size: 12px; opacity: 0.9;">Health help in simple terms</div>
                            </div>
                        </div>

                        <div class="medicare-chat-messages" id="medicareChatMessages">
                            <div class="medicare-disclaimer">
                                <strong>Important:</strong> This AI provides health info in simple terms for education only. Always consult healthcare professionals for medical advice.
                            </div>
                            
                            <div class="medicare-widget-message ai">
                                <div class="medicare-message-avatar">
                                    <i class="fas fa-stethoscope"></i>
                                </div>
                                <div class="medicare-message-content">
                                    Hello! I'm your MediCare+ AI Health Assistant. I can help explain health topics, MediCare+ features, and answer questions in simple, easy words.
                                </div>
                            </div>
                        </div>

                        <div class="medicare-chat-input-area">
                            <div class="medicare-quick-suggestions">
                                <button class="medicare-suggestion-btn" onclick="window.medicareChatWidget.sendSuggestion('What services does MediCare+ offer?')">MediCare+ Services</button>
                                <button class="medicare-suggestion-btn" onclick="window.medicareChatWidget.sendSuggestion('I have symptoms, can you help explain?')">Explain Symptoms</button>
                                <button class="medicare-suggestion-btn" onclick="window.medicareChatWidget.sendSuggestion('Give me simple wellness tips')">Wellness Tips</button>
                            </div>

                            <div class="medicare-input-row">
                                <input type="text" class="medicare-chat-input" id="medicareChatInput" placeholder="Ask about health or MediCare+ in simple terms..." maxlength="500">
                                <button class="medicare-send-btn" id="medicareSendBtn">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', widgetHTML);
        }

        setupEventListeners() {
            const toggle = document.getElementById('medicareChatToggle');
            const input = document.getElementById('medicareChatInput');
            const sendBtn = document.getElementById('medicareSendBtn');

            toggle.addEventListener('click', () => this.toggleChat());
            sendBtn.addEventListener('click', () => this.sendMessage());
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        toggleChat() {
            const container = document.getElementById('medicareChatContainer');
            const toggle = document.getElementById('medicareChatToggle');
            const icon = document.getElementById('medicareChatIcon');
            const badge = document.getElementById('medicareNotificationBadge');
            
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                container.classList.add('active');
                toggle.classList.add('active');
                icon.className = 'fas fa-times';
                badge.style.display = 'none';
                
                setTimeout(() => {
                    document.getElementById('medicareChatInput').focus();
                }, 300);
            } else {
                container.classList.remove('active');
                toggle.classList.remove('active');
                icon.className = 'fas fa-comments';
            }
        }

        sendSuggestion(message) {
            document.getElementById('medicareChatInput').value = message;
            this.sendMessage();
        }

        async sendMessage() {
            const input = document.getElementById('medicareChatInput');
            const sendBtn = document.getElementById('medicareSendBtn');
            const message = input.value.trim();

            if (!message || this.isTyping) return;

            this.addMessage('user', message);
            input.value = '';

            sendBtn.disabled = true;
            this.isTyping = true;
            this.showTyping();

            try {
                const response = await fetch('/api/ai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        context: {
                            previousMessages: this.messageHistory.slice(-4),
                            source: 'embedded-widget'
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                this.hideTyping();

                if (data.success) {
                    this.addMessage('ai', data.response);
                    this.updateStatus('online');
                    
                    this.messageHistory.push(
                        { role: 'user', content: message },
                        { role: 'assistant', content: data.response }
                    );
                } else {
                    this.addMessage('ai', data.fallback || 'Sorry, I cannot help right now. Please try again.');
                    this.updateStatus('error');
                }

            } catch (error) {
                console.error('MediCare+ Widget error:', error);
                this.hideTyping();
                this.addMessage('ai', 'Connection error. Please ensure the MediCare+ server is running.');
                this.updateStatus('offline');
            } finally {
                sendBtn.disabled = false;
                this.isTyping = false;
            }
        }

        addMessage(sender, content) {
            const messagesContainer = document.getElementById('medicareChatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `medicare-widget-message ${sender}`;

            const avatar = document.createElement('div');
            avatar.className = 'medicare-message-avatar';
            avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-stethoscope"></i>';

            const messageContent = document.createElement('div');
            messageContent.className = 'medicare-message-content';
            messageContent.innerHTML = this.formatMessage(content);

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
            messagesContainer.appendChild(messageDiv);

            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Show notification if closed
            if (!this.isOpen && sender === 'ai') {
                const badge = document.getElementById('medicareNotificationBadge');
                badge.style.display = 'flex';
            }
        }

        formatMessage(content) {
            return content
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/#{1,6}\s/g, '')
                .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/\n\n+/g, '<br><br>')
                .replace(/\n/g, '<br>')
                .replace(/^\s*[-*+]\s+/gm, '• ')
                .trim();
        }

        showTyping() {
            const messagesContainer = document.getElementById('medicareChatMessages');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'medicareTypingIndicator';
            typingDiv.innerHTML = `
                <div class="medicare-typing-indicator">
                    <span style="font-size: 12px; color: #6c757d;">AI is thinking</span>
                    <div class="medicare-typing-dots">
                        <div class="medicare-typing-dot"></div>
                        <div class="medicare-typing-dot"></div>
                        <div class="medicare-typing-dot"></div>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        hideTyping() {
            const typingIndicator = document.getElementById('medicareTypingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        updateStatus(status) {
            const statusDot = document.getElementById('medicareStatusDot');
            statusDot.className = 'medicare-status-dot';
            if (status === 'offline' || status === 'error') {
                statusDot.classList.add('offline');
            }
        }

        async testConnection() {
            try {
                const response = await fetch('/api/ai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Widget connection test' })
                });
                
                this.updateStatus(response.ok ? 'online' : 'offline');
            } catch (error) {
                this.updateStatus('offline');
            }
        }
    }

    // Initialize widget when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.medicareChatWidget = new MediCareChatWidget();
        });
    } else {
        window.medicareChatWidget = new MediCareChatWidget();
    }

})(); 