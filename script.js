// 初始化Swiper轮播
const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,
    },
});

// 作品集数据
const portfolioItems = [
    { title: 'AI画图', description: '稳定扩散式生成图片。', image: 'source/kele.png', category: '开发' },
    { title: 'AI商业计划书', description: 'AI收集信息生成大纲再进行PPT创作。', image: 'source/wutangcha.png', category: '设计', downloadPPT: 'source/wutangcha.pptx' },
    { title: 'AI聊天机器人', description: '使用自然语言处理技术，一个智能客服聊天机器人。', image: 'https://picsum.photos/300/200?random=10', category: '人工智能' }
];

// 动态添加作品集项目
function renderPortfolioItems() {
    const portfolioContainer = document.getElementById('portfolio-items');
    portfolioItems.forEach(item => {
        const itemHtml = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        ${item.downloadPPT ? `<a href="${item.downloadPPT}" class="btn btn-primary" download>下载PPT</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        portfolioContainer.innerHTML += itemHtml;
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolioItems();
});

// 处理联系表单提交
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // 这里添加表单提交逻辑，可以使用AJAX发送数据到服务器
    alert('感谢您的留言！我们会尽快回复您。');
    e.target.reset();
});

// AI对话功能
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', isUser ? 'user-message' : 'ai-message');
    messageElement.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
    
    // 将消息内容按换行符分割并添加<br>标签
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    messageElement.innerHTML = formattedMessage;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingAnimation() {
    const typingElement = document.createElement('div');
    typingElement.id = 'typing-animation';
    typingElement.innerHTML = '<span class="badge bg-secondary p-2">AI正在思考<span class="dot-animation">...</span></span>';
    chatWindow.appendChild(typingElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingAnimation() {
    const typingElement = document.getElementById('typing-animation');
    if (typingElement) {
        typingElement.remove();
    }
}

async function getAIResponse(message) {
    const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    const data = {
        model: "glm-4",
        messages: [
            {
                role: "user",
                content: message
            }
        ]
    };
    const headers = {
        'Authorization': 'Bearer 7574cd802017a8590cc9a410d1e94dbe.Y74xt1IdIzjdT7Ho',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        // 确保返回的内容中的换行符被保留
        return responseData.choices[0].message.content.replace(/\\n/g, '\n');
    } catch (error) {
        console.error('调用API时出错:', error);
        throw error;
    }
}

async function handleSendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        showTypingAnimation();
        
        try {
            const response = await getAIResponse(message);
            removeTypingAnimation();
            addMessage(response);
        } catch (error) {
            removeTypingAnimation();
            addMessage('抱歉，发生了错误，请稍后再试。');
        }
    }
}

sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});