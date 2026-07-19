class Point {
    constructor(x, y, label) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.radius = 10;
        this.isDragging = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isDragging ? '#38bdf8' : '#e2e8f0';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px Inter';
        ctx.fillText(this.label, this.x + 15, this.y - 15);
    }

    contains(mouseX, mouseY) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        return dx * dx + dy * dy <= (this.radius + 5) * (this.radius + 5);
    }
}

class App {
    constructor() {
        this.canvas = document.getElementById('geometryCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.draggedPoint = null;

        // Resize first so initPoints uses the correct canvas dimensions
        // We need to ensure draw() doesn't crash on empty points during this first resize
        this.resize();

        // Initialize points in a random quadrilateral shape (not a parallelogram initially)
        this.initPoints();

        window.addEventListener('resize', () => this.resize());

        // Explicit draw needed since resize() call above happened before points existed (or we rely on subsequent draw)
        this.draw();

        // Mouse Events
        this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));

        // Touch Events
        this.canvas.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleEnd.bind(this));

        // Controls
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.initPoints();
            this.draw();
            this.checkProofs();
        });

        document.getElementById('snapBtn').addEventListener('click', () => {
            this.snapToParallelogram();
            this.draw();
            this.checkProofs();
        });

        this.draw();
        this.checkProofs();
    }

    initPoints() {
        const GRID_SIZE = 40;
        // Snap center to grid
        const cx = Math.round((this.canvas.width / 2) / GRID_SIZE) * GRID_SIZE;
        const cy = Math.round((this.canvas.height / 2) / GRID_SIZE) * GRID_SIZE;

        // Parallelogram coordinates relative to center
        // Offsets chosen to be clean multiples of GRID_SIZE
        // shape:
        //      A________B
        //     /        /
        //    D________C

        this.points = [
            new Point(cx - 120, cy - 60, 'A'), // Top Left
            new Point(cx + 120, cy - 60, 'B'), // Top Right
            new Point(cx + 80, cy + 60, 'C'),  // Bottom Right
            new Point(cx - 160, cy + 60, 'D')  // Bottom Left
        ];

        // Verify Parallelogram logic for these coords:
        // AB vector: (+240, 0)
        // DC vector: C - D = (cx+80 - (cx-160), 0) = (+240, 0)
        // Parallel and congruent.
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        this.draw();
    }

    getMousePos(evt) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    handleStart(evt) {
        if (evt.touches) evt.preventDefault(); // Prevent scrolling on touch
        const { x, y } = this.getMousePos(evt);

        for (let p of this.points) {
            if (p.contains(x, y)) {
                this.draggedPoint = p;
                p.isDragging = true;
                break;
            }
        }
        this.draw();
    }

    handleMove(evt) {
        if (!this.draggedPoint) return;
        if (evt.touches) evt.preventDefault();

        const { x, y } = this.getMousePos(evt);

        // Snap to grid
        const GRID_SIZE = 40;
        this.draggedPoint.x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        this.draggedPoint.y = Math.round(y / GRID_SIZE) * GRID_SIZE;

        this.draw();
        this.checkProofs(); // Check logic while dragging
    }

    handleEnd(evt) {
        if (this.draggedPoint) {
            this.draggedPoint.isDragging = false;
            this.draggedPoint = null;
            this.draw();
            this.checkProofs();
        }
    }

    drawGrid() {
        const GRID_SIZE = 40;
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += GRID_SIZE) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }

        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += GRID_SIZE) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();

        if (this.points.length === 0) return;

        const [A, B, C, D] = this.points;

        // Draw Diagonals
        this.ctx.beginPath();

        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; // faint gray
        this.ctx.moveTo(A.x, A.y);
        this.ctx.lineTo(C.x, C.y);
        this.ctx.moveTo(B.x, B.y);
        this.ctx.lineTo(D.x, D.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw Quadrilateral
        this.ctx.beginPath();
        this.ctx.moveTo(A.x, A.y);
        this.ctx.lineTo(B.x, B.y);
        this.ctx.lineTo(C.x, C.y);
        this.ctx.lineTo(D.x, D.y);
        this.ctx.closePath();

        // Fill
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        this.ctx.fill();

        // Stroke
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.drawIndicators();

        // Draw Points
        for (let p of this.points) {
            p.draw(this.ctx);
        }
    }

    drawIndicators() {
        const [A, B, C, D] = this.points;
        const ctx = this.ctx;

        const mAB = this.slope(A, B);
        const mBC = this.slope(B, C);
        const mCD = this.slope(C, D);
        const mDA = this.slope(D, A);

        const dAB = this.dist(A, B);
        const dBC = this.dist(B, C);
        const dCD = this.dist(C, D);
        const dDA = this.dist(D, A);

        const mid = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
        const angle = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

        // Helper to draw tick marks (congruence)
        const drawTick = (p1, p2, count) => {
            const m = mid(p1, p2);
            const a = angle(p1, p2);
            const len = 10;
            const sep = 4;

            ctx.strokeStyle = '#f8fafc'; // white
            ctx.lineWidth = 2;
            ctx.save();
            ctx.translate(m.x, m.y);
            ctx.rotate(a);

            // Draw 'count' ticks
            const start = -((count - 1) * sep) / 2;
            for (let i = 0; i < count; i++) {
                const x = start + i * sep;
                ctx.beginPath();
                ctx.moveTo(x, -len / 2);
                ctx.lineTo(x, len / 2);
                ctx.stroke();
            }
            ctx.restore();
        };

        // Helper to draw arrow marks (parallel)
        const drawArrow = (p1, p2, count) => {
            const m = mid(p1, p2);
            const a = angle(p1, p2);

            ctx.fillStyle = '#f8fafc';
            ctx.save();
            ctx.translate(m.x, m.y);
            ctx.rotate(a);

            // Triangle arrow
            const size = 6;
            const sep = size * 1.5;
            const start = -((count - 1) * sep) / 2;

            for (let i = 0; i < count; i++) {
                const x = start + i * sep;
                ctx.beginPath();
                ctx.moveTo(x - size / 2, -size / 2); // back top
                ctx.lineTo(x + size / 2, 0);       // tip
                ctx.lineTo(x - size / 2, size / 2);  // back bottom
                ctx.fill();
            }
            ctx.restore();
        };

        const EPS_SLOPE = 0.05;
        const EPS_DIST = 2;

        const isPar = (m1, m2) => {
            if (m1 === Infinity && m2 === Infinity) return true;
            if (m1 === Infinity || m2 === Infinity) return false;
            return Math.abs(m1 - m2) < EPS_SLOPE;
        }
        const isEq = (d1, d2) => Math.abs(d1 - d2) < EPS_DIST;

        // Draw Congruence Ticks
        if (isEq(dAB, dCD)) {
            drawTick(A, B, 1);
            drawTick(C, D, 1);
        }
        if (isEq(dBC, dDA)) {
            drawTick(B, C, 2);
            drawTick(D, A, 2);
        }

        // Draw Parallel Arrows
        if (isPar(mAB, mCD)) {
            drawArrow(A, B, 1);
            drawArrow(D, C, 1);
        }
        if (isPar(mBC, mDA)) {
            drawArrow(B, C, 2);
            drawArrow(A, D, 2);
        }
    }

    // Geometry Helpers
    dist(p1, p2) {
        return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }

    slope(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        if (Math.abs(dx) < 0.001) return Infinity; // Vertical line
        return dy / dx;
    }

    midpoint(p1, p2) {
        return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    }

    // A helper to calculate angle at vertex p2 (between p1 and p3)
    angle(p1, p2, p3) {
        const d12 = this.dist(p1, p2);
        const d23 = this.dist(p2, p3);
        const d13 = this.dist(p1, p3);
        // Cosine rule: c^2 = a^2 + b^2 - 2ab cos(C)
        // d13^2 = d12^2 + d23^2 - 2*d12*d23*cos(angle)
        // cos(angle) = (d12^2 + d23^2 - d13^2) / (2*d12*d23)
        const cosVal = (d12 * d12 + d23 * d23 - d13 * d13) / (2 * d12 * d23);
        // Clamp for float errors
        const clamped = Math.max(-1, Math.min(1, cosVal));
        return Math.acos(clamped) * (180 / Math.PI);
    }

    snapToParallelogram() {
        const [A, B, C, D] = this.points;
        // Let's keep A, B, and D fixed and move C to complete the parallelogram
        // In a parallelogram, midpoint of AC = midpoint of BD
        // (Ax + Cx)/2 = (Bx + Dx)/2  => Cx = Bx + Dx - Ax
        // (Ay + Cy)/2 = (By + Dy)/2  => Cy = By + Dy - Ay

        C.x = B.x + D.x - A.x;
        C.y = B.y + D.y - A.y;
    }

    isConvex(points) {
        let signs = [];
        const n = points.length;
        for (let i = 0; i < n; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % n];
            const p3 = points[(i + 2) % n];

            // Vector p1->p2
            const dx1 = p2.x - p1.x;
            const dy1 = p2.y - p1.y;
            // Vector p2->p3
            const dx2 = p3.x - p2.x;
            const dy2 = p3.y - p2.y;

            // Cross product 2D (z-component)
            const cross = dx1 * dy2 - dy1 * dx2;
            signs.push(cross);
        }

        const allPos = signs.every(s => s >= 0);
        const allNeg = signs.every(s => s <= 0);
        return allPos || allNeg;
    }

    checkProofs() {
        const [A, B, C, D] = this.points;

        // 1. Data Calculation
        const mAB = this.slope(A, B);
        const mBC = this.slope(B, C);
        const mCD = this.slope(C, D);
        const mDA = this.slope(D, A);

        const dAB = this.dist(A, B);
        const dBC = this.dist(B, C);
        const dCD = this.dist(C, D);
        const dDA = this.dist(D, A);

        const angA = this.angle(D, A, B);
        const angB = this.angle(A, B, C);
        const angC = this.angle(B, C, D);
        const angD = this.angle(C, D, A);

        const midAC = this.midpoint(A, C);
        const midBD = this.midpoint(B, D);

        // 2. Fuzzy Checks (epsilon)
        const EPS_SLOPE = 0.05; // allow some slack for interaction
        const EPS_DIST = 2;     // pixels
        const EPS_ANGLE = 2;    // degrees

        const isParallel = (m1, m2) => {
            if (m1 === Infinity && m2 === Infinity) return true;
            if (m1 === Infinity || m2 === Infinity) return false;
            return Math.abs(m1 - m2) < EPS_SLOPE;
        };

        const isCongruent = (d1, d2) => Math.abs(d1 - d2) < EPS_DIST;

        const isSamePoint = (p1, p2) => this.dist(p1, p2) < EPS_DIST;

        // 3. Evaluate Conditions
        const ab_cd_par = isParallel(mAB, mCD);
        const bc_da_par = isParallel(mBC, mDA);

        const ab_cd_eq = isCongruent(dAB, dCD);
        const bc_da_eq = isCongruent(dBC, dDA);

        const a_c_eq = isCongruent(angA, angC);
        const b_d_eq = isCongruent(angB, angD);

        const diags_bisect = isSamePoint(midAC, midBD);

        // 4. Update UI

        // Update Text Stats
        const fmt = (n) => n === Infinity ? 'Inf' : n.toFixed(2);

        document.getElementById('slope-AB-CD').textContent = `mAB: ${fmt(mAB)}, mCD: ${fmt(mCD)}`;
        document.getElementById('slope-BC-DA').textContent = `mBC: ${fmt(mBC)}, mDA: ${fmt(mDA)}`;

        document.getElementById('len-AB-CD').textContent = `AB: ${dAB.toFixed(0)}, CD: ${dCD.toFixed(0)}`;
        document.getElementById('len-BC-DA').textContent = `BC: ${dBC.toFixed(0)}, DA: ${dDA.toFixed(0)}`;

        document.getElementById('angle-A-C').textContent = `∠A: ${angA.toFixed(1)}°, ∠C: ${angC.toFixed(1)}°`;
        document.getElementById('angle-B-D').textContent = `∠B: ${angB.toFixed(1)}°, ∠D: ${angD.toFixed(1)}°`;

        document.getElementById('mid-AC-BD').textContent = `Distance between midpoints: ${this.dist(midAC, midBD).toFixed(1)}`;

        // Update Coordinates Panel
        document.getElementById('coord-A').textContent = `A: (${A.x}, ${A.y})`;
        document.getElementById('coord-B').textContent = `B: (${B.x}, ${B.y})`;
        document.getElementById('coord-C').textContent = `C: (${C.x}, ${C.y})`;
        document.getElementById('coord-D').textContent = `D: (${D.x}, ${D.y})`;

        // List Checks
        const checkItem = (id, condition) => {
            const el = document.getElementById(id);
            if (condition) el.classList.add('success');
            else el.classList.remove('success');
            return condition;
        };

        const isPolyConvex = this.isConvex(this.points);

        const c1 = checkItem('proof-sides-parallel', ab_cd_par && bc_da_par);
        const c2 = checkItem('proof-sides-congruent', ab_cd_eq && bc_da_eq && isPolyConvex);
        const c3 = checkItem('proof-angles-congruent', a_c_eq && b_d_eq && isPolyConvex);
        const c4 = checkItem('proof-diagonals', diags_bisect);
        const isVectorEq = (p1, p2, q1, q2) => {
            const dx1 = p2.x - p1.x;
            const dy1 = p2.y - p1.y;
            const dx2 = q2.x - q1.x;
            const dy2 = q2.y - q1.y;
            return Math.abs(dx1 - dx2) < EPS_DIST && Math.abs(dy1 - dy2) < EPS_DIST;
        };

        const c5 = checkItem('proof-one-pair', isVectorEq(A, B, D, C) || isVectorEq(B, C, A, D));

        // Global Success
        const anySuccess = c1 || c2 || c3 || c4 || c5;
        const msg = document.getElementById('successMessage');
        if (anySuccess) {
            msg.classList.remove('hidden');
            // Check if it's a rectangle
            const isRect = Math.abs(angA - 90) < EPS_ANGLE;
            msg.textContent = isRect ? "Parallelogram (Rectangle)!" : "It's a Parallelogram!";
        } else {
            msg.classList.add('hidden');
        }
    }
}

// Init
window.onload = () => {
    new App();
};
