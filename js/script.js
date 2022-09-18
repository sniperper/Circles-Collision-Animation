

window.onload = function() {
    new CirclesMovement().init();
}


class CirclesMovement {
    constructor() {
        this.numberOfCircles = 100;
        this.minRadius = 20;
        this.variantRadius = 15;
        this.strokeColor = 'white';
        this.fillColor = 'rgb(240, 248, 255, 0.2)'
    }

    init() {
        this.createCanvas();
        this.resetCanvasSize();
        this.createCircles();
        this.updateAnimation();
        
        window.addEventListener('resize', () => {
            this.resetCanvasSize();
        })
    }

    updateAnimation() {
        this.clearCanvas();
        this.updateCircles();
        this.getIntersection();
        this.circles.forEach(circle => {
            this.drawCircle(circle.x, circle.y, circle.radius, circle.strokeColor, circle.fillColor);
        })

        window.requestAnimationFrame(() => this.updateAnimation());
    }

    createCanvas() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    resetCanvasSize() {
        this.w = canvas.width = window.innerWidth;   
        this.h = canvas.height = window.innerHeight;
    }

    createCircles() {
        this.circles = [];

        for (let i = 0; i < this.numberOfCircles; i++) {
            let angle = Math.random() * 100;
            let newCircle = {
                fillColor: this.fillColor,
                strokeColor: this.strokeColor,
                radius: this.minRadius + Math.random() * this.variantRadius,
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                velocityX: Math.cos(angle),
                velocityY: Math.sin(angle),
                
            };
            this.circles.push(newCircle);
        }
    }

    updateCircles() {
        this.circles.forEach(circle => {
            if (circle.x + circle.radius > this.w && circle.velocityX > 0 || circle.x < circle.radius && circle.velocityX < 0) {
                circle.velocityX *= -1;
            }
            if (circle.y + circle.radius > this.h && circle.velocityY > 0 || circle.y < circle.radius && circle.velocityY < 0) {
                circle.velocityY *= -1;
            }

            circle.x += circle.velocityX;
            circle.y += circle.velocityY;
        })
    }


    drawCircle(x, y, radius, strokeColor, fillColor) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = strokeColor;
        this.ctx.fillStyle = fillColor;
        this.ctx.stroke();
        this.ctx.fill();        
    }

    getIntersection() {
        for (let i = 0; i < this.circles.length; i++) {
            let circleA = this.circles[i];
            for (let j = i+1; j < this.circles.length; j++) {
                let circleB = this.circles[j];

                let dx = circleB.x - circleA.x;
                let dy = circleB.y - circleA.y;
                let distance = Math.hypot(dx, dy);

                if (distance <= circleA.radius + circleB.radius) {
                    this.circleBounce(circleA, circleB, distance, dx ,dy);  
                }
            }
        }
    }

    circleBounce(circleA, circleB, distance, dx, dy) {
        let normalaizedV = {
            x: dx/distance,
            y: dy/distance,
        };

        let dxA = Math.abs(circleA.velocityX - circleA.x);
        let dyA = Math.abs(circleA.velocityY - circleA.y);
        let distanceA = Math.hypot(dxA, dyA);
        let normalaizedVA = {
            x: dxA/distanceA,
            y: dyA/distanceA,
        };

        let vectorA = {
            x: (-1 * normalaizedV.x + normalaizedVA.x) ,
            y: (-1 * normalaizedV.y + normalaizedVA.y) ,
        };

        let vectorB = {
            x: (normalaizedV.x + normalaizedVA.x* -1),
            y: (normalaizedV.y + normalaizedVA.y * -1),
        };

        circleA.velocityX = vectorA.x;
        circleA.velocityY = vectorA.y;
        circleB.velocityX = vectorB.x;
        circleB.velocityY = vectorB.y;
        
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

}
