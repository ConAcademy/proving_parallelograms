
const EPS_SLOPE = 0.05;
const EPS_DIST = 2;

function dist(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function slope(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    if (Math.abs(dx) < 0.001) return Infinity;
    return dy / dx;
}

function isPar(m1, m2) {
    if (m1 === Infinity && m2 === Infinity) return true;
    if (m1 === Infinity || m2 === Infinity) return false;
    return Math.abs(m1 - m2) < EPS_SLOPE;
}
function isEq(d1, d2) { return Math.abs(d1 - d2) < EPS_DIST; }

function checkOnePairOld(A, B, C, D) {
    const mAB = slope(A, B);
    const mCD = slope(C, D);
    const mBC = slope(B, C);
    const mDA = slope(D, A);

    const dAB = dist(A, B);
    const dCD = dist(C, D);
    const dBC = dist(B, C);
    const dDA = dist(D, A);

    const ab_cd_par = isPar(mAB, mCD);
    const bc_da_par = isPar(mBC, mDA);
    const ab_cd_eq = isEq(dAB, dCD);
    const bc_da_eq = isEq(dBC, dDA);

    return (ab_cd_par && ab_cd_eq) || (bc_da_par && bc_da_eq);
}

function isVectorEq(p1, p2, q1, q2) {
    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = q2.x - q1.x;
    const dy2 = q2.y - q1.y;
    return Math.abs(dx1 - dx2) < EPS_DIST && Math.abs(dy1 - dy2) < EPS_DIST;
}

function checkOnePairNew(A, B, C, D) {
    return isVectorEq(A, B, D, C) || isVectorEq(B, C, A, D);
}

const square = {
    A: { x: 0, y: 100 }, B: { x: 100, y: 100 },
    C: { x: 100, y: 0 }, D: { x: 0, y: 0 }
};
// Order: A(TL) -> B(TR) -> C(BR) -> D(BL).
// AB = (100,0). CD = (-100, 0). AB || CD. Length 100.
// DC = (100, 0). AB = DC. 

const bowtie = {
    A: { x: 0, y: 100 }, B: { x: 100, y: 100 },
    C: { x: 0, y: 0 }, D: { x: 100, y: 0 }
};
// Order: A(TL) -> B(TR) -> C(BL) -> D(BR).
// AB = (100, 0).
// CD = (100, 0).
// AB || CD. Length 100. -> Old Check PASS.
// DC = (-100, 0).
// AB != DC. -> New Check FAIL.

console.log("Square Old Check:", checkOnePairOld(square.A, square.B, square.C, square.D));
console.log("Square New Check:", checkOnePairNew(square.A, square.B, square.C, square.D));
console.log("Bowtie Old Check:", checkOnePairOld(bowtie.A, bowtie.B, bowtie.C, bowtie.D));
console.log("Bowtie New Check:", checkOnePairNew(bowtie.A, bowtie.B, bowtie.C, bowtie.D));
