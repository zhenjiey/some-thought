document.addEventListener('DOMContentLoaded', () => {
    // 对话数据
    const dialogues = {
        start: {
            girlMessage: "下午好啊，今天工作怎么样？",
            options: [
                { text: "挺忙的，对了，你今晚加班到12点吗？要我去接你吗？", nextId: "pickup" },
                { text: "今天有点累，不过还是想来接你下班，你12点结束吧？", nextId: "tired" },
                { text: "还行，听说你今晚要加班到很晚，我来接你吧", nextId: "boring" }
            ]
        },
        pickup: {
            girlMessage: "是啊，今晚要忙到12点呢。你来接我呀？这么晚了不会麻烦你吗？",
            options: [
                { text: "不麻烦，我也要熬夜打游戏，正好顺路", nextId: "game" },
                { text: "这么晚，我怕你打车不安全，来接你吧", nextId: "safety" },
                { text: "我都习惯了，接你下班是我的日常", nextId: "routine" }
            ]
        },
        game: {
            girlMessage: "你又熬夜打游戏啊？对了，你吃晚饭了吗？我这边饿得不行了",
            options: [
                { text: "我随便吃了点，你饿了啊？要不要一起吃夜宵？", nextId: "lateNightSnack" },
                { text: "还没吃呢，等接你一起找地方吃吧", nextId: "eatTogether" },
                { text: "我吃过了，但陪你吃点夜宵没问题", nextId: "accompany" }
            ]
        },
        safety: {
            girlMessage: "嗯，确实挺晚的。谢谢你愿意来接我，我公司楼下这边打车也不太好叫",
            options: [
                { text: "那我一定准时到，你饿不饿？要不要吃点夜宵？", nextId: "askSnack" },
                { text: "没事，应该的。我在附近找个停车位等你", nextId: "parking" },
                { text: "12点那边路上应该不堵，很快就能到你公司", nextId: "traffic" }
            ]
        },
        routine: {
            girlMessage: "你别这么敷衍嘛，这么晚了肯定会打乱你的休息时间啊",
            options: [
                { text: "没事，反正我也是个夜猫子", nextId: "nightOwl" },
                { text: "我白天在公司已经打了个盹了，精神着呢", nextId: "nap" },
                { text: "为了你，晚点睡也值得啊！", nextId: "worthIt" }
            ]
        },
        lateNightSnack: {
            girlMessage: "好啊！那你有什么推荐的地方吗？这么晚了，不知道哪里还开着",
            options: [
                { text: "公司附近不是有家24小时营业的兰州拉面吗？", nextId: "noodles" },
                { text: "要不去夜市吧，那边12点后也很热闹", nextId: "nightMarket" },
                { text: "我知道一家不错的烧烤，离你公司不远", nextId: "bbq" }
            ]
        },
        eatTogether: {
            girlMessage: "好，那我们一起吃吧，我都快饿晕了。加班太辛苦了，都没时间吃饭",
            options: [
                { text: "辛苦了，那我们去吃你最喜欢的那家火锅吧", nextId: "hotpot" },
                { text: "要不要我先给你带点吃的？饼干零食什么的", nextId: "snackFirst" },
                { text: "我看看附近有什么夜宵外卖，给你点一份先垫垫肚子", nextId: "delivery" }
            ]
        },
        accompany: {
            girlMessage: "那太感谢了，不过你已经吃过了，就陪我点点小吃就好",
            options: [
                { text: "没事，我正好可以再吃点夜宵，反正年轻不怕胖", nextId: "young" },
                { text: "好，你想吃什么我都陪你", nextId: "anything" },
                { text: "那去吃甜品怎么样？我吃正餐吃饱了，但甜点还是可以的", nextId: "dessert" }
            ]
        },
        noodles: {
            girlMessage: "对哦，那家拉面店不错！他们的牛肉面特别好吃，这么冷的晚上吃碗热乎的面条正合适",
            options: [
                { text: "那就这么定了！我12点到公司楼下等你", nextId: "waiting" },
                { text: "好，你要是提前下班就发消息给我，我马上出发", nextId: "early" },
                { text: "除了牛肉面，他家的馄饨也不错，可以尝尝", nextId: "wonton" }
            ]
        },
        nightMarket: {
            girlMessage: "夜市啊，感觉好久没去了，那边确实挺多好吃的，就是人可能会多",
            options: [
                { text: "人多才有气氛嘛，而且可以边走边吃，很有意思的", nextId: "atmosphere" },
                { text: "如果你不想去人多的地方，我们可以换个安静点的", nextId: "quiet" },
                { text: "那边有家臭豆腐特别出名，我们可以去试试", nextId: "tofu" }
            ]
        },
        bbq: {
            girlMessage: "烧烤？！太好了，我今天特别想吃烤串，这么冷的天气吃烧烤最幸福了",
            options: [
                { text: "他家烤羊肉串特别入味，我们可以多点几串", nextId: "lamb" },
                { text: "对啊，再来两瓶啤酒，工作的疲劳就飞走了", nextId: "beer" },
                { text: "不过这么晚吃烧烤，你不怕长胖吗？", nextId: "weight" }
            ]
        },
        askSnack: {
            girlMessage: "好啊，我确实有点饿了。这么晚了，不知道哪里还有吃的",
            options: [
                { text: "附近有家宵夜粥店，粥和小菜都很不错", nextId: "porridge" },
                { text: "要不我们去便利店买点泡面和关东煮？", nextId: "instant" },
                { text: "网上点外卖怎么样？这样你下班就能直接吃到了", nextId: "takeout" }
            ]
        },
        waiting: {
            girlMessage: "好的，那等我忙完这边的工作，12点见！不过公司可能会晚几分钟才能走",
            options: [
                { text: "没关系，我就在楼下等你，不着急", nextId: "noRush" },
                { text: "行，你忙完了给我发消息，我就在车里等", nextId: "carWait" },
                { text: "多晚都行，反正我明天不用早起", nextId: "noEarlyRise" }
            ]
        },
        noRush: {
            girlMessage: "谢谢你愿意等我！(工作结束后) 我下来啦，你在哪里呢？",
            options: [
                { text: "我在正门这边，穿着黑色外套", nextId: "blackJacket" },
                { text: "我已经看到你了，正在朝你走过来", nextId: "walking" },
                { text: "我在停车场，你往右手边走就能看到我的车", nextId: "carpark" }
            ]
        },
        blackJacket: {
            girlMessage: "看到你了！今天真的太谢谢你了，大半夜的还来接我",
            options: [
                { text: "重新开始对话", nextId: "start" }
            ]
        },
        
        // 男生视角对话
        boyStart: {
            boyMessage: "嘿，听说你今晚要加班到12点？需要我去接你吗？",
            options: [
                { text: "是啊，如果不麻烦你的话，谢谢了", nextId: "boyPickup" },
                { text: "不用了，我可以打车回去", nextId: "boyTaxi" },
                { text: "那太好了，我正好想吃点夜宵，一起？", nextId: "boySnack" }
            ]
        },
        boyPickup: {
            boyMessage: "不麻烦，正好我今晚也要熬夜，顺便想逗你玩一下，嘿嘿",
            options: [
                { text: "你又要搞什么恶作剧？大晚上的别吓我啊", nextId: "boyPrank" },
                { text: "你真好，那我12点公司门口等你", nextId: "boyWait" },
                { text: "熬夜对身体不好，你最近熬夜太多了", nextId: "boyCare" }
            ]
        },
        boyPrank: {
            boyMessage: "哈哈，被你猜到了！不过不会吓你的，就是想在车里藏个小惊喜而已~",
            options: [
                { text: "你这个捣蛋鬼，我都不敢坐你的车了", nextId: "boyMischief" },
                { text: "只要不是吓我就行，我工作够累的了", nextId: "boyTired" },
                { text: "好吧，我就勉为其难期待一下你的惊喜", nextId: "boyExpect" }
            ]
        },
        boyMischief: {
            boyMessage: "哎呀，真的不是啦！就是买了你最爱吃的蛋糕，想给你个小惊喜而已，别想太多啦",
            options: [
                { text: "蛋糕？！你怎么知道我今晚想吃甜食", nextId: "boyCake" },
                { text: "那我就放心了，你有时候恶作剧太过了", nextId: "boyRelief" },
                { text: "好吧我相信你，对了，待会要不要一起吃点夜宵？", nextId: "boyLateSnack" }
            ]
        },
        boyLateSnack: {
            boyMessage: "正有此意！我已经看好了一家夜宵店，他们家的小龙虾超级入味，你一定会喜欢的！",
            options: [
                { text: "这么了解我，小龙虾是我的最爱！", nextId: "boyCrayfish" },
                { text: "你确定这么晚吃小龙虾不会消化不良吗？", nextId: "boyDigestion" },
                { text: "好啊，我加班加得都要饿扁了", nextId: "boyHungry" }
            ]
        }
    };

    const messagesContainer = document.getElementById('messages');
    const optionsContainer = document.getElementById('options-container');
    const switchToBoyBtn = document.getElementById('switch-to-boy');
    const switchToGirlBtn = document.getElementById('switch-to-girl');
    const restartBtn = document.getElementById('restart-btn');
    
    // 当前角色状态
    let currentPerspective = 'girl'; // 'girl' 或 'boy'
    
    // 初始化对话
    startDialogue(currentPerspective === 'girl' ? 'start' : 'boyStart');
    
    // 角色切换事件处理
    switchToBoyBtn.addEventListener('click', () => {
        if (currentPerspective !== 'boy') {
            currentPerspective = 'boy';
            updateProfileView();
            resetChat();
            startDialogue('boyStart');
        }
    });
    
    switchToGirlBtn.addEventListener('click', () => {
        if (currentPerspective !== 'girl') {
            currentPerspective = 'girl';
            updateProfileView();
            resetChat();
            startDialogue('start');
        }
    });
    
    // 重新开始按钮
    restartBtn.addEventListener('click', () => {
        resetChat();
        startDialogue(currentPerspective === 'girl' ? 'start' : 'boyStart');
    });
    
    // 更新个人资料显示
    function updateProfileView() {
        const profilePicture = document.querySelector('.profile-picture');
        const profileName = document.querySelector('.profile-name');
        
        // 更新按钮状态
        switchToBoyBtn.classList.toggle('active', currentPerspective === 'boy');
        switchToGirlBtn.classList.toggle('active', currentPerspective === 'girl');
        
        // 更新个人资料
        if (currentPerspective === 'boy') {
            profilePicture.className = 'profile-picture boy-avatar';
            profileName.textContent = '郝天';
        } else {
            profilePicture.className = 'profile-picture girl-avatar';
            profileName.textContent = '薛家燕';
        }
    }
    
    // 重置聊天
    function resetChat() {
        messagesContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
    }

    // 开始对话函数
    function startDialogue(dialogueId) {
        const dialogue = dialogues[dialogueId];
        if (!dialogue) return; // 防止undefined
        
        // 清空之前的对话选项
        optionsContainer.innerHTML = '';
        
        // 显示消息
        if (currentPerspective === 'girl') {
            showTyping();
            
            // 模拟打字效果
            setTimeout(() => {
                showMessage(dialogue.girlMessage, 'girl');
                
                // 显示对话选项
                setTimeout(() => {
                    showOptions(dialogue.options);
                }, 500);
            }, 1500);
        } else {
            showTyping();
            
            // 模拟打字效果
            setTimeout(() => {
                showMessage(dialogue.boyMessage || "...", 'boy');
                
                // 显示对话选项
                setTimeout(() => {
                    showOptions(dialogue.options);
                }, 500);
            }, 1500);
        }
    }

    // 显示"正在输入"的效果
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', currentPerspective, 'typing');
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 显示消息
    function showMessage(text, sender) {
        // 移除"正在输入"的效果
        const typingElement = document.querySelector('.typing');
        if (typingElement) {
            typingElement.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 显示玩家消息
    function showPlayerMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'player');
        messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // 显示对话选项
    function showOptions(options) {
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option.text;
            button.addEventListener('click', () => {
                // 显示玩家的选择
                showPlayerMessage(option.text);
                
                // 禁用所有按钮，防止重复点击
                disableAllOptions();
                
                // 延迟后继续对话
                setTimeout(() => {
                    startDialogue(option.nextId);
                }, 1000);
            });
            optionsContainer.appendChild(button);
        });
    }

    // 禁用所有对话选项
    function disableAllOptions() {
        const buttons = optionsContainer.querySelectorAll('.option-button');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'default';
        });
    }
}); 