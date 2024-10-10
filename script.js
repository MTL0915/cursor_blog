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
    { 
        title: 'AI画图 - 可乐海报', 
        description: '鼠标移入可乐位置，生成AI广告海报。', 
        image: 'source/kele-old.jpg', 
        hoverImage: 'source/kele.png', 
        category: '开发' 
    },
    { title: 'AI商业计划书', description: 'AI收集信息生成大纲再进行PPT创作。', image: 'source/wutangcha.png', category: '设计', downloadPPT: 'source/wutangcha.pptx' },
    { 
        title: 'AI视频 - 瞬息全宇宙logo', 
        description: '鼠标移入图片logo，查看AI视频。', 
        image: 'source/logo.png', 
        hoverVideo: 'source/logo-video.mp4', 
        category: '人工智能' 
    }
];

// 动态添加作品集项目
function renderPortfolioItems() {
    const portfolioContainer = document.getElementById('portfolio-items');
    portfolioItems.forEach(item => {
        let mediaHtml;
        if (item.hoverVideo) {
            mediaHtml = `
                <div class="media-container" style="position: relative; cursor: pointer; padding-top: 56.25%;">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                    <video src="${item.hoverVideo}" class="card-img-top" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" muted loop></video>
                </div>
            `;
        } else {
            mediaHtml = `
                <div class="media-container" style="position: relative; cursor: pointer; padding-top: 56.25%;">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}" 
                         style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
                         ${item.hoverImage ? `data-hover-image="${item.hoverImage}"` : ''}>
                </div>
            `;
        }

        const itemHtml = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    ${mediaHtml}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text flex-grow-1">${item.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div></div>
                            ${item.downloadPPT ? `<a href="${item.downloadPPT}" class="btn btn-primary" download>下载PPT</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        portfolioContainer.innerHTML += itemHtml;
    });

    // 添加鼠标悬停事件监听器
    const portfolioCards = document.querySelectorAll('#portfolio-items .card');
    portfolioCards.forEach(card => {
        const mediaContainer = card.querySelector('.media-container');
        const img = mediaContainer.querySelector('img.card-img-top');
        const video = mediaContainer.querySelector('video.card-img-top');
        
        if (video) {
            mediaContainer.addEventListener('mouseenter', () => {
                img.style.display = 'none';
                video.style.display = 'block';
                video.play();
            });
            mediaContainer.addEventListener('mouseleave', () => {
                video.style.display = 'none';
                img.style.display = 'block';
                video.pause();
                video.currentTime = 0;
            });
        } else if (img.dataset.hoverImage) {
            const originalSrc = img.src;
            const hoverImage = img.dataset.hoverImage;
            mediaContainer.addEventListener('mouseenter', () => {
                img.src = hoverImage;
            });
            mediaContainer.addEventListener('mouseleave', () => {
                img.src = originalSrc;
            });
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolioItems();
});

// 处理联系表单提交
// const contactForm = document.getElementById('contact-form');
// if (contactForm) {
//     contactForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         alert('感谢您的留言！我们会尽快回复您。');
//         e.target.reset();
//     });
// }

// AI对话功能
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

if (chatWindow && userInput && sendButton) {
    // 只有当所有元素都存在时，才添加事件监听器和初始化聊天功能
    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', isUser ? 'user-message' : 'ai-message');
        messageElement.innerHTML = `
            <div class="message-content ${isUser ? 'bg-primary text-white' : 'bg-light'} p-2 rounded mb-2">
                ${message.replace(/\n/g, '<br>')}
            </div>
        `;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function showTypingAnimation() {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-animation';
        typingElement.innerHTML = '<div class="message-content bg-light p-2 rounded mb-2"><span class="badge bg-secondary">AI正在思考<span class="dot-animation">...</span></span></div>';
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
            return responseData.choices[0].message.content;
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
} else {
    console.error('无法找到聊天功能所需的一个或多个元素');
}