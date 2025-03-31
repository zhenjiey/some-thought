const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// 游戏变量
let player;
let obstacles = [];
let score = 0;
let gameSpeed = 3;
let gravity = 0.6;
let jumpForce = -14;
let isGameOver = false;
let animationFrameId;
let gameStarted = false; // 游戏是否已开始
const winDuration = 30000; // 30秒通关 (以毫秒为单位)
let startTime = null;

// 图片资源
let playerImg = new Image();
let backgroundImg = new Image();
let imagesLoaded = 0;
const totalImages = 2; // 总共需要加载的图片数量
playerImg.src = 'dog.png'; // 玩家图片路径
backgroundImg.src = 'background.png'; // 背景图片路径

// 图片加载处理
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // 所有图片加载完成后，显示开始画面
        console.log("所有图片加载完毕，显示开始画面");
        showStartScreen();
    }
}

playerImg.onload = onImageLoad;
backgroundImg.onload = onImageLoad;
playerImg.onerror = () => console.error("加载玩家图片 dog.png 失败");
backgroundImg.onerror = () => console.error("加载背景图片 background.png 失败");

// 背景滚动位置
let backgroundX = 0;

// 玩家对象
class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocityY = 0;
        this.isJumping = false;
        this.groundY = canvasHeight - this.height - 10; // 地面位置，留出一点边距
        this.jumpsLeft = 2; // 添加剩余跳跃次数
    }

    draw() {
        if (playerImg.complete && playerImg.naturalHeight !== 0) { // 确保图片已加载且有效
             ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
        } else {
             // 图片未加载或加载失败时绘制占位符
            ctx.fillStyle = 'blue'; // 保持原来的颜色作为后备
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    applyGravity() {
        this.velocityY += gravity;
        this.y += this.velocityY;

        // 防止掉出地面
        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
            this.jumpsLeft = 2; // 落地后重置跳跃次数
        }
    }

    jump() {
        if (this.jumpsLeft > 0) { // 检查是否有剩余跳跃次数
            this.velocityY = jumpForce;
            this.isJumping = true; // 标记为正在跳跃（用于应用重力）
            this.jumpsLeft--; // 消耗一次跳跃
        }
    }

    update() {
        this.applyGravity();
        this.draw();
    }
}

// 障碍物对象
class Obstacle {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
        this.draw();
    }
}

// 生成障碍物
function spawnObstacle() {
    const minHeight = 20;
    const maxHeight = 70;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    const width = 20;
    const obstacleY = canvasHeight - height - 10; // 障碍物出现在地面上
    const obstacleX = canvasWidth;

    obstacles.push(new Obstacle(obstacleX, obstacleY, width, height, 'red', gameSpeed));
}

// 碰撞检测
function checkCollision(player, obstacle) {
    const playerRight = player.x + player.width;
    const playerBottom = player.y + player.height;
    const obstacleRight = obstacle.x + obstacle.width;
    const obstacleBottom = obstacle.y + obstacle.height;

    // 简单的 AABB 碰撞检测
    return (
        player.x < obstacleRight &&
        playerRight > obstacle.x &&
        player.y < obstacleBottom &&
        playerBottom > obstacle.y
    );
}

// 游戏结束处理
function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(animationFrameId);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvasWidth / 2, canvasHeight / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText('按 R 键重新开始', canvasWidth / 2, canvasHeight / 2 + 20);
    console.log("游戏结束");
}

// 游戏胜利处理
function gameWin() {
    isGameOver = true; // 游戏结束，但显示胜利信息
    cancelAnimationFrame(animationFrameId);
    ctx.fillStyle = 'rgba(0, 100, 0, 0.7)'; // 绿色背景
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('恭喜通关!', canvasWidth / 2, canvasHeight / 2 - 30);
    ctx.font = '24px Arial';
    ctx.fillText('你将获得下班免费接送福利', canvasWidth / 2, canvasHeight / 2 + 20);
    ctx.font = '20px Arial';
    ctx.fillText('按 R 键重新开始', canvasWidth / 2, canvasHeight / 2 + 60);
    console.log("游戏胜利");
}


// 游戏循环
let lastObstacleSpawnTime = 0;
let obstacleSpawnInterval = 2000; // 初始生成间隔

function gameLoop(timestamp) {
    if (isGameOver) return;

    if (!startTime) {
        startTime = timestamp; // 记录游戏开始时间
    }

    const elapsedTime = timestamp - startTime;

    // 检查是否达到胜利条件
    if (elapsedTime >= winDuration) {
        gameWin();
        return;
    }

    // 清除画布，改为绘制滚动背景
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (backgroundImg.complete && backgroundImg.naturalHeight !== 0) { // 确保图片已加载且有效
        // 计算背景滚动位置
        backgroundX -= gameSpeed * 0.5; // 背景滚动速度可以比游戏慢一点
        if (backgroundX <= -canvasWidth) {
            backgroundX = 0;
        }
        // 绘制两张背景图实现无缝滚动
        ctx.drawImage(backgroundImg, backgroundX, 0, canvasWidth, canvasHeight);
        ctx.drawImage(backgroundImg, backgroundX + canvasWidth, 0, canvasWidth, canvasHeight);
    } else {
         // 背景图未加载或加载失败时显示纯色背景
        ctx.fillStyle = '#87CEEB'; // 天蓝色背景作为后备
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // 更新玩家
    player.update();

    // 更新和生成障碍物
    const currentTime = Date.now();
    if (currentTime - lastObstacleSpawnTime > obstacleSpawnInterval) {
        spawnObstacle();
        lastObstacleSpawnTime = currentTime;
        // 随机调整下次生成间隔，让游戏更有趣
        obstacleSpawnInterval = Math.random() * 1500 + 1000; // 1秒到2.5秒之间
        // 随时间增加游戏速度和障碍物速度 (可选)
        // gameSpeed += 0.1;
    }

    // 移动和绘制障碍物，并进行碰撞检测
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].speed = gameSpeed; // 确保障碍物速度与游戏速度一致
        obstacles[i].update();

        // 碰撞检测
        if (checkCollision(player, obstacles[i])) {
            gameOver();
            return;
        }

        // 移除屏幕外的障碍物
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++; // 可以加分，但当前需求不显示分数
        }
    }

    // 显示计时器 (可选)
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`剩余时间: ${((winDuration - elapsedTime) / 1000).toFixed(1)} 秒`, 10, 20);

    animationFrameId = requestAnimationFrame(gameLoop);
}

// 初始化游戏
function initGame() {
    isGameOver = false;
    gameStarted = true;
    startTime = null; // 重置开始时间
    score = 0;
    obstacles = [];
    gameSpeed = 3; // 重置速度
    player = new Player(50, canvasHeight - 50 - 10, 30, 50, 'blue'); // 初始位置调整
    player.y = player.groundY; // 确保玩家在地面上
    lastObstacleSpawnTime = Date.now();
    obstacleSpawnInterval = 2000;

    // 清除可能存在的结束画面
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 开始游戏循环
    cancelAnimationFrame(animationFrameId); // 确保之前的循环已停止
    animationFrameId = requestAnimationFrame(gameLoop);
}

// 显示开始提示
function showStartScreen() {
    // 清除画布以防旧内容残留
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // 可以先绘制一次背景
    if (backgroundImg.complete && backgroundImg.naturalHeight !== 0) {
        ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);
    } else {
        ctx.fillStyle = '#87CEEB'; // 天蓝色背景
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('按空格键或点击屏幕开始游戏和跳跃', canvasWidth / 2, canvasHeight / 2);
}

// 跳跃或开始游戏的统一函数
function handleInteraction() {
    if (!gameStarted) {
        initGame();
    } else if (!isGameOver) {
        player.jump();
    }
}

// 事件监听
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // 防止页面滚动
        handleInteraction(); // 调用统一处理函数
    }
    if (isGameOver && e.code === 'KeyR') { // 按 R 键重新开始
       gameStarted = false; // 重置开始状态
       // 清除游戏结束/胜利画面，显示开始画面
       ctx.clearRect(0, 0, canvasWidth, canvasHeight);
       showStartScreen();
    }
});

// 添加触摸和鼠标点击事件监听
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // 防止触发鼠标事件以及页面滚动
    handleInteraction();
});

canvas.addEventListener('mousedown', (e) => {
    // 通常触摸事件会优先触发，这个主要用于桌面鼠标点击
    handleInteraction();
});

// 初始显示开始画面 (注释掉，等待图片加载完成)
// window.onload = () => {
//     showStartScreen();
// };
// 图片加载完成后会自动调用 showStartScreen 