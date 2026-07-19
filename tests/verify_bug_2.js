
const EPS_ANGLE = 2;
const EPS_DIST = 2;

function dist(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function angle(p1, p2, p3) {
    const d12 = dist(p1, p2);
    const d23 = dist(p2, p3);
    const d13 = dist(p1, p3);
    const cosVal = (d12 * d12 + d23 * d23 - d13 * d13) / (2 * d12 * d23);
    const clamped = Math.max(-1, Math.min(1, cosVal));
    return Math.acos(clamped) * (180 / Math.PI);
}

function isEq(v1, v2, eps) {
    return Math.abs(v1 - v2) < eps;
}

// Polygon Convexity Check using Cross Product Z-component sign
function isConvex(points) {
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

    const allPos = signs.every(s => s > 0);
    const allNeg = signs.every(s => s < 0);
    return allPos || allNeg;
}

// Points for an Antiparallelogram (Bowtie)
// A(0, 100), B(100, 100), C(0, 0), D(100, 0)
// Order A -> B -> C -> D
// AB: Horizontal Top.
// BC: Diagonal /
// CD: Horizontal Bottom (Right to Left if following order? No C(0,0) to D(100,0) is Left to Right)
//     Wait. C(0,0) -> D(100,0) is Vector (100,0).
//     AB (0,100)->(100,100) is Vector (100,0).
//     So AB is parallel to CD. One Pair check is fixed (AB != DC).
//     But let's check Angles and Sides.
const bowtie = [
    { x: 0, y: 100, label: 'A' },
    { x: 100, y: 100, label: 'B' },
    { x: 0, y: 0, label: 'C' },
    { x: 100, y: 0, label: 'D' }
];
const [A, B, C, D] = bowtie;

console.log("--- Bowtie Analysis ---");

// Sides
const dAB = dist(A, B); // 100
const dCD = dist(C, D); // 100
const dBC = dist(B, C); // sqrt(100^2 + 100^2) ~ 141.4
const dDA = dist(D, A); // sqrt(100^2 + 100^2) ~ 141.4

console.log(`Sides: AB=${dAB}, CD=${dCD}, BC=${dBC.toFixed(1)}, DA=${dDA.toFixed(1)}`);
console.log(`Congruent Sides (AB=CD && BC=DA): ${isEq(dAB, dCD, EPS_DIST) && isEq(dBC, dDA, EPS_DIST)}`);

// Angles
// A: D-A-B. D(100,0), A(0,100), B(100,100). 
//    DA vector (100,-100). AB vector (100,0).
//    Angle? 45 degrees.
const angA = angle(D, A, B);
const angB = angle(A, B, C);
const angC = angle(B, C, D);
const angD = angle(C, D, A);

console.log(`Angles: A=${angA.toFixed(1)}, B=${angB.toFixed(1)}, C=${angC.toFixed(1)}, D=${angD.toFixed(1)}`);
// For this symmetric bowtie:
// A (TopLeft): 45 deg
// B (TopRight): 45 deg
// C (BottomLeft): 45 deg
// D (BottomRight): 45 deg
// Wait, is that right?
// B: A(0,100), B(100,100), C(0,0).
//    BA (-100, 0). BC (-100, -100).
//    Angle is 45 deg.
// So ALL angles are 45 deg.
// Thus A=C and B=D.
console.log(`Congruent Angles (A=C && B=D): ${isEq(angA, angC, EPS_ANGLE) && isEq(angB, angD, EPS_ANGLE)}`);

// Convexity
console.log(`Is Convex: ${isConvex([A, B, C, D])}`);

