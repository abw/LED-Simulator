import React from 'react'
import Matrix from './Model/Matrix'
import MatrixDisplay from './Display/Matrix'
import Pattern from './Patterns/MultiModA'

class Ledsim extends React.Component {
    static defaultProps = {
        width: 32,
        height: 32,
    }
    constructor(props) {
        super(props);
        this.animate = this.stepAnimation.bind(this);
        this.matrix = new Matrix(props);
        this.pattern = new Pattern(props);
        this.startTime = Date.now();
        this.state = {
            grid: this.matrix.grid,
        };
    }
    componentDidMount() {
         this.startAnimation();
    }
    componentWillUnmount() {
        this.stopAnimation();
    }
    scheduleAnimationStep() {
        window.requestAnimationFrame(this.animate);
    }
    startAnimation() {
        this.lastTick = Date.now();
        this.frameCount = 0;
        this.setState({ animating: true });
        this.scheduleAnimationStep();
    }
    stepAnimation() {
        if (this.state.animating) {
            this.tick();
            this.scheduleAnimationStep();
        }
    }
    stopAnimation() {
        this.setState({ animating: false });
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
        }
    }
    tick() {
        this.animateCells();
        let tick = Date.now();
        this.frameCount++;
        if (this.frameCount % 10 === 9) {
            this.fps  = Math.floor(10000 / (tick - this.lastTick));
            this.lastTick = tick;
        }
        this.setState({
            time: (tick - this.startTime) / 1000,
            grid: this.matrix.grid,
            fps: this.fps,
        });
    }
    animateCells() {
        let {time} = this.state;
        this.matrix.grid.forEach(
            (row, y) => row.forEach(
                (cell, x) => row[x] = this.pattern.cell(time, x, y)
            )
        );
    }
    render() {
        let {grid, fps} = this.state;
        return <React.Fragment>
          <header>
            <h1>Led Matrix Simulator</h1>
            <h2 className="author">by Andy Wardley</h2>
          </header>
          <main>
          <MatrixDisplay grid={grid}/>
          </main>
          <footer>
            <div className="info">
              {fps} FPS
            </div>
            <button onClick={() => this.startAnimation()}>Start</button>
            <button onClick={() => this.stopAnimation()}>Stop</button>
          </footer>
        </React.Fragment>
    }
}

export default Ledsim
