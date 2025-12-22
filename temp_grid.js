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
        this.ctx.lineTo(this.canvas.height * 2, y); // Ensure covers width
    }
    // Correct loop for full width
    for (let y = 0; y <= this.canvas.height; y += GRID_SIZE) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
    }

    this.ctx.stroke();
}
