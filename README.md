# Proving Parallelograms Explorer

A dynamic, interactive educational tool designed to help Geometry students explore and understand the properties required to prove that a quadrilateral is a parallelogram.

## Overview

This web-based application allows students to manipulate the vertices of a quadrilateral in real-time. As they manipulate the shape, the application continuously calculates slopes, side lengths, and angles to verify if the shape meets specific geometric conditions (theorems) that prove it is a parallelogram.

## Features

- **Interactive Canvas**: Drag-and-drop vertices to change the shape dynamically.
- **Snap-to-Grid**: Points snap to a grid for cleaner integer-based coordinates.
- **Logic Verification**: Automatically checks 5 distinct proof conditions:
    1.  Both pairs of opposite sides are parallel.
    2.  Both pairs of opposite sides are congruent.
    3.  Both pairs of opposite angles are congruent.
    4.  Diagonals bisect each other.
    5.  One pair of opposite sides is both parallel and congruent.
- **Visual Indicators**:
    - **Tick marks** for congruent sides.
    - **Arrows** for parallel sides.
- **Snap Tool**: A "Snap to Parallelogram" button to instantly form a perfect parallelogram from the current points.

## How to Run

Simply open `index.html` in any modern web browser. No installation or server is required.

## Technologies Used

- **HTML5 Canvas**: For high-performance 2D rendering.
- **Vanilla JavaScript**: For all logic and interactivity (no frameworks).
- **CSS3**: For modern styling and layout.
