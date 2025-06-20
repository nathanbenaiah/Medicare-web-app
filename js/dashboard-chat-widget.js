/**
 * MediCare+ Dashboard Integrated Chat Widget
 * Enhanced AI chat experience within the user dashboard
 */

class DashboardChatWidget {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.isInitialized = false;
        this.connectionStatus = 'connecting';
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createChatWidget();
        this.attachEventListeners();
        this.testConnection();
        this.isInitialized = true;
        
        console.log('🤖 Dashboard Chat Widget initialized');
    }

    createChatWidget() {
        const chatHTML = `
            <!-- Chat Toggle Button -->
            <div id="dashboardChatToggle" class="dashboard-chat-toggle" title="AI Health Assistant">
                <div class="chat-toggle-icon">
                    <i class="fas fa-stethoscope"></i>
                </div>
                <div class="chat-notification-badge" id="chatNotificationBadge" style="display: none;">
                    <span>1</span>
                </div>
            </div>

            <!-- Chat Container -->
            <div id="dashboardChatContainer" class="dashboard-chat-container">
                <!-- Chat Header -->
                <div class="dashboard-chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <i class="fas fa-stethoscope"></i>
                        </div>
                        <div class="chat-title">
                            <h4>MediCare+ AI Assistant</h4>
                            <p class="chat-status-text" id="chatStatusText">Connecting...</p>
                        </div>
                    </div>
                    <div class="chat-header-actions">
                        <button class="chat-minimize" id="chatMinimize" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="chat-close" id="chatClose" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="dashboard-chat-messages" id="dashboardChatMessages">
                    <!-- Welcome Message -->
                    <div class="chat-message ai">
                        <div class="message-avatar">
                            <i class="fas fa-stethoscope"></i>
                        </div>
                        <div class="message-content">
                            <strong>Welcome to MediCare+ AI Assistant!</strong><br><br>
                            I'm here to help you with:
                            <ul>
                                <li>🩺 Understanding health symptoms</li>
                                <li>💊 Medication information</li>
                                <li>📋 Health assessments guidance</li>
                                <li>📅 Appointment scheduling help</li>
                                <li>🏥 General health advice</li>
                            </ul>
                            <em>How can I assist you today?</em>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="chat-quick-actions">
                    <button class="quick-action-btn" onclick="dashboardChat.sendQuickMessage('I need help with my symptoms')">
                        <i class="fas fa-thermometer-half"></i>
                        Symptoms Help
                    </button>
                    <button class="quick-action-btn" onclick="dashboardChat.sendQuickMessage('How do I book an appointment?')">
                        <i class="fas fa-calendar-plus"></i>
                        Book Appointment
                    </button>
                    <button class="quick-action-btn" onclick="dashboardChat.sendQuickMessage('Tell me about health assessments')">
                        <i class="fas fa-clipboard-check"></i>
                        Assessments
                    </button>
                </div>

                <!-- Chat Input -->
                <div class="dashboard-chat-input">
                    <div class="input-container">
                        <textarea 
                            id="dashboardChatInput" 
                            placeholder="Ask me anything about your health..." 
                            rows="1"
                        ></textarea>
                        <button id="dashboardChatSend" class="send-button" title="Send Message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add chat widget to dashboard
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        // Add CSS styles
        this.injectStyles();
    }

    injectStyles() {
        const styles = `
            <style id="dashboard-chat-styles">
                /* Chat Toggle Button */
                .dashboard-chat-toggle {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-lg);
                    transition: all var(--transition-normal);
                    z-index: var(--z-fixed);
                    user-select: none;
                }

                .dashboard-chat-toggle:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-xl);
                }

                .dashboard-chat-toggle.active {
                    background: linear-gradient(135deg, var(--error) 0%, #dc2626 100%);
                }

                .chat-toggle-icon {
                    color: white;
                    font-size: 24px;
                    transition: transform var(--transition-normal);
                }

                .dashboard-chat-toggle:hover .chat-toggle-icon {
                    transform: scale(1.1);
                }

                .chat-notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--error);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    animation: pulse 2s infinite;
                }

                /* Chat Container */
                .dashboard-chat-container {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 380px;
                    height: 500px;
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                    display: flex;
                    flex-direction: column;
                    transform: translateY(100%) scale(0.8);
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--transition-normal);
                    z-index: var(--z-modal);
                    border: 1px solid var(--border);
                }

                .dashboard-chat-container.active {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                    visibility: visible;
                }

                /* Chat Header */
                .dashboard-chat-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-4);
                    border-bottom: 1px solid var(--border);
                    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
                    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                }

                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }

                .chat-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                }

                .chat-title h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .chat-status-text {
                    margin: 0;
                    font-size: 12px;
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                }

                .chat-status-text::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--success);
                    animation: pulse 2s infinite;
                }

                .chat-status-text.offline::before {
                    background: var(--error);
                }

                .chat-header-actions {
                    display: flex;
                    gap: var(--space-2);
                }

                .chat-minimize,
                .chat-close {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: transparent;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--text-secondary);
                    transition: all var(--transition-fast);
                }

                .chat-minimize:hover,
                .chat-close:hover {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                }

                /* Chat Messages */
                .dashboard-chat-messages {
                    flex: 1;
                    padding: var(--space-4);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                    background: linear-gradient(135deg, #f8fafc 0%, white 100%);
                }

                .chat-message {
                    display: flex;
                    gap: var(--space-3);
                    animation: fadeInUp 0.3s ease;
                }

                .chat-message.user {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .chat-message.ai .message-avatar {
                    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
                    color: white;
                }

                .chat-message.user .message-avatar {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: white;
                }

                .message-content {
                    max-width: 70%;
                    padding: var(--space-3) var(--space-4);
                    border-radius: var(--radius-lg);
                    font-size: 14px;
                    line-height: 1.5;
                }

                .chat-message.ai .message-content {
                    background: white;
                    border: 1px solid var(--border);
                    color: var(--text-primary);
                    border-bottom-left-radius: var(--radius-xs);
                }

                .chat-message.user .message-content {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: white;
                    border-bottom-right-radius: var(--radius-xs);
                }

                .message-content ul {
                    margin: var(--space-2) 0;
                    padding-left: var(--space-4);
                }

                .message-content li {
                    margin: var(--space-1) 0;
                }

                /* Quick Actions */
                .chat-quick-actions {
                    padding: var(--space-3);
                    border-top: 1px solid var(--border);
                    display: flex;
                    gap: var(--space-2);
                    flex-wrap: wrap;
                    background: var(--bg-secondary);
                }

                .quick-action-btn {
                    flex: 1;
                    min-width: 100px;
                    padding: var(--space-2) var(--space-3);
                    border: 1px solid var(--border);
                    background: white;
                    border-radius: var(--radius-md);
                    font-size: 12px;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    display: flex;
                    align-items: center;
                    gap: var(--space-2);
                    color: var(--text-primary);
                }

                .quick-action-btn:hover {
                    border-color: var(--primary);
                    background: rgba(37, 99, 235, 0.05);
                    color: var(--primary);
                }

                .quick-action-btn i {
                    font-size: 14px;
                }

                /* Chat Input */
                .dashboard-chat-input {
                    padding: var(--space-4);
                    border-top: 1px solid var(--border);
                    background: var(--bg-primary);
                    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
                }

                .input-container {
                    display: flex;
                    gap: var(--space-3);
                    align-items: end;
                }

                #dashboardChatInput {
                    flex: 1;
                    padding: var(--space-3);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    font-size: 14px;
                    font-family: inherit;
                    resize: none;
                    min-height: 40px;
                    max-height: 100px;
                    transition: border-color var(--transition-fast);
                    background: white;
                }

                #dashboardChatInput:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .send-button {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    border: none;
                    border-radius: var(--radius-lg);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--transition-fast);
                    font-size: 14px;
                }

                .send-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-md);
                }

                .send-button:disabled {
                    background: var(--gray-300);
                    cursor: not-allowed;
                    transform: none;
                }

                /* Typing Indicator */
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    padding: var(--space-3);
                    margin: var(--space-2) 0;
                }

                .typing-dots {
                    display: flex;
                    gap: 3px;
                }

                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--text-secondary);
                    border-radius: 50%;
                    animation: typing 1.5s infinite;
                }

                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-8px); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .dashboard-chat-container {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 120px);
                        bottom: 10px;
                        right: 10px;
                    }

                    .dashboard-chat-toggle {
                        bottom: 20px;
                        right: 20px;
                        width: 55px;
                        height: 55px;
                    }

                    .quick-action-btn {
                        min-width: 80px;
                        font-size: 11px;
                        padding: var(--space-2);
                    }
                }
            </style>
        `;

        if (!document.getElementById('dashboard-chat-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    attachEventListeners() {
        const toggle = document.getElementById('dashboardChatToggle');
        const closeBtn = document.getElementById('chatClose');
        const minimizeBtn = document.getElementById('chatMinimize');
        const sendBtn = document.getElementById('dashboardChatSend');
        const input = document.getElementById('dashboardChatInput');

        toggle?.addEventListener('click', () => this.toggleChat());
        closeBtn?.addEventListener('click', () => this.closeChat());
        minimizeBtn?.addEventListener('click', () => this.minimizeChat());
        sendBtn?.addEventListener('click', () => this.sendMessage());

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        input?.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }

    toggleChat() {
        const container = document.getElementById('dashboardChatContainer');
        const toggle = document.getElementById('dashboardChatToggle');
        const badge = document.getElementById('chatNotificationBadge');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            container.classList.add('active');
            toggle.classList.add('active');
            badge.style.display = 'none';
            
            setTimeout(() => {
                document.getElementById('dashboardChatInput')?.focus();
            }, 300);
        } else {
            container.classList.remove('active');
            toggle.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('dashboardChatContainer').classList.remove('active');
        document.getElementById('dashboardChatToggle').classList.remove('active');
    }

    minimizeChat() {
        this.closeChat();
    }

    sendQuickMessage(message) {
        document.getElementById('dashboardChatInput').value = message;
        this.sendMessage();
    }

    async sendMessage() {
        const input = document.getElementById('dashboardChatInput');
        const sendBtn = document.getElementById('dashboardChatSend');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage('user', message);
        input.value = '';
        input.style.height = 'auto';

        // Disable input
        sendBtn.disabled = true;
        this.isTyping = true;
        this.showTypingIndicator();

        try {
            // Try main AI chat first, fallback to test endpoint if API key not configured
            let response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    context: {
                        previousMessages: this.messageHistory.slice(-4),
                        source: 'dashboard-widget',
                        userContext: this.getUserContext()
                    }
                })
            });

            // If main endpoint fails due to API key, try test endpoint
            if (response.ok) {
                const data = await response.json();
                if (!data.success && data.error && data.error.includes('401')) {
                    console.log('🔄 API key not configured, using test mode...');
                    response = await fetch('/api/test-chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: message })
                    });
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.success) {
                this.addMessage('ai', data.response);
                this.updateConnectionStatus('online');
                
                this.messageHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.response }
                );
            } else {
                this.addMessage('ai', data.fallback || 'I apologize, but I cannot process your question at the moment. Please try again later.');
                this.updateConnectionStatus('error');
            }

        } catch (error) {
            console.error('Dashboard Chat Error:', error);
            this.hideTypingIndicator();
            
            let errorMessage = 'I apologize, there was a connection error.';
            if (error.message.includes('fetch')) {
                errorMessage = 'Unable to connect to the AI service. Please ensure the server is running.';
            }
            
            this.addMessage('ai', errorMessage);
            this.updateConnectionStatus('offline');
        } finally {
            sendBtn.disabled = false;
            this.isTyping = false;
        }
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('dashboardChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-stethoscope"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show notification if closed
        if (!this.isOpen && sender === 'ai') {
            document.getElementById('chatNotificationBadge').style.display = 'flex';
        }
    }

    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/#{1,6}\s/g, '')
            .replace(/`{1,3}(.*?)`{1,3}/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\n\n+/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/^\s*[-*+]\s+/gm, '• ')
            .trim();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('dashboardChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'dashboardTypingIndicator';
        typingDiv.className = 'chat-message ai';

        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-stethoscope"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span style="font-size: 12px; color: var(--text-secondary);">AI is thinking</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('dashboardTypingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateConnectionStatus(status) {
        this.connectionStatus = status;
        const statusText = document.getElementById('chatStatusText');
        
        if (statusText) {
            switch (status) {
                case 'online':
                    statusText.textContent = 'Online';
                    statusText.className = 'chat-status-text';
                    break;
                case 'offline':
                    statusText.textContent = 'Offline';
                    statusText.className = 'chat-status-text offline';
                    break;
                case 'error':
                    statusText.textContent = 'Connection Error';
                    statusText.className = 'chat-status-text offline';
                    break;
                default:
                    statusText.textContent = 'Connecting...';
                    statusText.className = 'chat-status-text';
            }
        }
    }

    async testConnection() {
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                this.updateConnectionStatus('online');
                console.log('✅ Dashboard chat connected to server');
            } else {
                this.updateConnectionStatus('offline');
                console.log('❌ Dashboard chat server not responding');
            }
        } catch (error) {
            this.updateConnectionStatus('offline');
            console.log('❌ Dashboard chat connection failed:', error.message);
        }
    }

    getUserContext() {
        // Get user context from dashboard if available
        return {
            page: 'dashboard',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100)
        };
    }

    // Public API methods
    show() {
        if (!this.isOpen) {
            this.toggleChat();
        }
    }

    hide() {
        if (this.isOpen) {
            this.closeChat();
        }
    }

    destroy() {
        // Clean up event listeners and DOM elements
        const elements = [
            'dashboardChatToggle',
            'dashboardChatContainer',
            'dashboard-chat-styles'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
        
        this.isInitialized = false;
        console.log('🗑️ Dashboard Chat Widget destroyed');
    }
}

// Initialize dashboard chat widget when DOM is ready
let dashboardChat;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboardChat = new DashboardChatWidget();
        window.dashboardChat = dashboardChat;
    });
} else {
    dashboardChat = new DashboardChatWidget();
    window.dashboardChat = dashboardChat;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardChatWidget;
} 