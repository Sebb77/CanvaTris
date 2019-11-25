import React from 'react';
import './App.css';

const SQUARE_SIZE = 20;
const COLORS = [
  "#369DFF" // I
, "#F25D07" // L
, "#2D55AD" // J
, "#FFAE00" // O
, "#08A60D" // S
, "#DC2322" // Z
, "#8053B8" // T
];
const TETRAMINOES = [
  [ // I
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ],
  [ // L
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [ // Jconst TETRAMINOES_NAMES = ["I", "L", "J"]

    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [ // O
    [1, 1],
    [1, 1],
  ],
  [ // S
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [ // Z
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [ // T
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]
];

class App extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // get reference to board canvas and its context
    this.board = this.refs.Board;
    this.ctx = this.board.getContext("2d");

    this.updateCanvas();
  }

  render() {  
    return (
      <div className="App">
        <h1>CanvaTris</h1>
        <canvas ref="Board" className="Board" width={200} height={400}/>
      </div>
    );
  }

  drawBoard() {
    this.ctx.fillStyle = "#e3e3e3";
    this.ctx.strokeStyle = "#9c9c9c";
    this.ctx.lineWidth = 1;

    // create board border
    this.ctx.fillRect(0, 0, this.board.width, this.board.height);
    this.ctx.strokeRect(1, 1, this.board.width-2, this.board.height-2);

    // create grid's vertical lines
    for (let x = SQUARE_SIZE; x < this.board.width; x += SQUARE_SIZE) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.board.height);
      this.ctx.stroke();
    }

    // create grid's horizontal lines
    for (let y = SQUARE_SIZE; y < this.board.height; y += SQUARE_SIZE) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.board.width, y);
      this.ctx.stroke();
    }
  }

  updateCanvas() {
    this.drawBoard();
    this.drawPiece(0, 0, 1);
  }

  drawPiece(xOffset, yOffset, piece) {
    const t = TETRAMINOES[piece];
    t.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.drawSquare(x + xOffset, y + yOffset, COLORS[piece]);
        }
      });
    });
  }

  drawSquare(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * SQUARE_SIZE, 
                      y * SQUARE_SIZE,
                      SQUARE_SIZE,
                      SQUARE_SIZE
    );

    this.ctx.strokeStyle = "BLACK";
    this.ctx.strokeRect(x * SQUARE_SIZE, 
                        y * SQUARE_SIZE,
                        SQUARE_SIZE,
                        SQUARE_SIZE
    );
  }
}

export default App;
