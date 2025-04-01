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
        this.score = 0;
        this.spawnBug();
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
            this.bugs.push({
                x: Math.random() * this.canvas.width,
                y: 0,
                width: 20,
                height: 20,
                color: 'green',
                speed: Math.random() * 3 + 1
            });
        }, 1000);
    }

    detectCollision(bullet, bug) {
        return (
            bullet.x < bug.x + bug.width &&
            bullet.x + bullet.width > bug.x &&
            bullet.y < bug.y + bug.height &&
            bullet.y + bullet.height > bug.y
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

        // Collision detection
        this.player.bullets.forEach((bullet, bulletIndex) => {
            this.bugs.forEach((bug, bugIndex) => {
                if (this.detectCollision(bullet, bug)) {
                    this.player.bullets.splice(bulletIndex, 1);
                    this.bugs.splice(bugIndex, 1);
                    this.score++;
                }
            });
        });

        // Display score
        this.context.fillStyle = 'black';
        this.context.fillText(`Score: ${this.score}`, 10, 20);

        requestAnimationFrame(this.update.bind(this));
    }
}

new Game();
