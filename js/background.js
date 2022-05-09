(function () {
    var STAR_COUNT = (window.innerWidth + window.innerHeight) / 8,
        STAR_SIZE = 3,
        STAR_MIN_SCALE = 0.2,
        OVERFLOW_THRESHOLD = 50;
    var canvas = document.getElementById("background"),
        context = canvas.getContext("2d");
    var scale = 1,
        width = void 0,
        height = void 0;
    var stars = [];
    var pointerX = void 0,
        pointerY = void 0;
    var velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
    var touchInput = false;
    generate();
    resize();
    step();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    function generate() {
        for (var b = 0; b < STAR_COUNT; b++) {
            stars.push({
                x: 0,
                y: 0,
                z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
            });
        }
    }
    function placeStar(b) {
        b.x = Math.random() * width;
        b.y = Math.random() * height;
    }
    function recycleStar(h) {
        var g = "z";
        var i = Math.abs(velocity.tx),
            j = Math.abs(velocity.ty);
        if (i > 1 && j > 1) {
            var f = void 0;
            if (i > j) {
                f = Math.random() < Math.abs(velocity.x) / (i + j) ? "h" : "v";
            } else {
                f = Math.random() < Math.abs(velocity.y) / (i + j) ? "v" : "h";
            }
            if (f === "h") {
                g = velocity.x > 0 ? "l" : "r";
            } else {
                g = velocity.y > 0 ? "t" : "b";
            }
        }
        h.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);
        if (g === "z") {
            h.z = 0.1;
            h.x = Math.random() * width;
            h.y = Math.random() * height;
        } else {
            if (g === "l") {
                h.x = -STAR_SIZE;
                h.y = height * Math.random();
            } else {
                if (g === "r") {
                    h.x = width + STAR_SIZE;
                    h.y = height * Math.random();
                } else {
                    if (g === "t") {
                        h.x = width * Math.random();
                        h.y = -STAR_SIZE;
                    } else {
                        if (g === "b") {
                            h.x = width * Math.random();
                            h.y = height + STAR_SIZE;
                        }
                    }
                }
            }
        }
    }
    function resize() {
        scale = window.devicePixelRatio || 1;
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;
        canvas.width = width;
        canvas.height = height;
        stars.forEach(placeStar);
    }
    function step() {
        context.clearRect(0, 0, width, height);
        update();
        render();
        requestAnimationFrame(step);
    }
    function update() {
        velocity.tx *= 0.95;
        velocity.ty *= 0.95;
        velocity.x += (velocity.tx - velocity.x) * 0.7;
        velocity.y += (velocity.ty - velocity.y) * 0.7;
        stars.forEach(function (b) {
            b.x += velocity.x * b.z;
            b.y += velocity.y * b.z;
            b.x += (b.x - width / 2) * velocity.z * b.z;
            b.y += (b.y - height / 2) * velocity.z * b.z;
            b.z += velocity.z;
            if (
                b.x < -OVERFLOW_THRESHOLD ||
                b.x > width + OVERFLOW_THRESHOLD ||
                b.y < -OVERFLOW_THRESHOLD ||
                b.y > height + OVERFLOW_THRESHOLD
            ) {
                recycleStar(b);
            }
        });
    }
    function render() {
        stars.forEach(function (d) {
            context.beginPath();
            context.lineCap = "round";
            context.lineWidth = STAR_SIZE * d.z * scale;
            context.strokeStyle = "rgba(102,175,239,.3)";
            context.beginPath();
            context.moveTo(d.x, d.y);
            var e = velocity.x * 2,
                f = velocity.y * 2;
            if (Math.abs(e) < 0.1) {
                e = 0.5;
            }
            if (Math.abs(f) < 0.1) {
                f = 0.5;
            }
            context.lineTo(d.x + e, d.y + f);
            context.stroke();
        });
    }
    function movePointer(g, h) {
        if (typeof pointerX === "number" && typeof pointerY === "number") {
            var e = g - pointerX,
                f = h - pointerY;
            velocity.tx = velocity.x + (e / 8) * scale * (touchInput ? -1 : 1);
            velocity.ty = velocity.y + (f / 8) * scale * (touchInput ? -1 : 1);
        }
        pointerX = g;
        pointerY = h;
    }
    function onMouseMove(b) {
        touchInput = false;
        movePointer(b.clientX, b.clientY);
    }
    function onMouseLeave() {
        pointerX = null;
        pointerY = null;
    }
})();
