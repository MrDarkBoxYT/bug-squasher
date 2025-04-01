class Game {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            width: 20,
            height: 20,
            color: 'blue',
            bullets: []
        };

        this.bugs = [];
        this.powerUps = [];
        this.score = 0;
        this.level = 1;
        this.spawnBug();
        this.spawnPowerUp();
        this.bindEvents();
        this.update();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.player.x -= 10;
            if (e.key === 'ArrowRight') this.player.x += 10;
            if (e.key === ' ') this.shootBullet();
        });
    }

    shootBullet() {
        this.player.bullets.push({
            x: this.player.x + this.player.width / 2,
            y: this.player.y,
            width: 5,
            height: 10,
            color: 'red'
        });
    }

    spawnBug() {
        setInterval(() => {
            let size = Math.random() * 20 + 10;
            this.bugs.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                width: size,
                height: size,
                color: 'green',
                speed: Math.random() * 3 + this.level
            });
        }, 1000);
    }

    spawnPowerUp() {
        setInterval(() => {
            this.powerUps.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                width: 20,
                height: 20,
                color: 'yellow',
                speed: 2
            });
        }, 10000);
    }

    detectCollision(bullet, bug) {
        return (
            bullet.x < bug.x + bug.width &&
            bullet.x + bullet.width > bug.x &&
            bullet.y < bug.y + bug.height &&
            bullet.y + bullet.height > bug.y
        );
    }

    detectPowerUpCollision(player, powerUp) {
        return (
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
        );
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update player
        this.context.fillStyle = this.player.color;
        this.context.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Update bullets
        this.player.bullets = this.player.bullets.filter(bullet => bullet.y > 0);
        this.player.bullets.forEach(bullet => {
            bullet.y -= 5;
            this.context.fillStyle = bullet.color;
            this.context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Update bugs
        this.bugs.forEach(bug => {
            bug.y += bug.speed;
            this.context.fillStyle = bug.color;
            this.context.fillRect(bug.x, bug.y, bug.width, bug.height);
        });

        // Update power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.y += powerUp.speed;
            this.context.fillStyle = powerUp.color;
            this.context.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        });

        // Collision detection
        this.player.bullets.forEach((bullet, bulletIndex) => {
            this.bugs.forEach((bug, bugIndex) => {
                if (this.detectCollision(bullet, bug)) {
                    this.player.bullets.splice(bulletIndex, 1);
                    this.bugs.splice(bugIndex, 1);
                    this.score++;
                    if (this.score % 10 === 0) {
                        this.level++;
                    }
                }
            });
        });

        // Power-up collision detection
        this.powerUps.forEach((powerUp, powerUpIndex) => {
            if (this.detectPowerUpCollision(this.player, powerUp)) {
                this.powerUps.splice(powerUpIndex, 1);
                this.player.color = 'red'; // Change player color as a power-up effect
                setTimeout(() => {
                    this.player.color = 'blue'; // Revert player color after power-up effect ends
                }, 5000);
            }
        });

        // Display score and level
        this.context.fillStyle = 'black';
        this.context.fillText(`Score: ${this.score}`, 10, 20);
        this.context.fillText(`Level: ${this.level}`, 10, 40);

        requestAnimationFrame(this.update.bind(this));
    }
}

new Game();
