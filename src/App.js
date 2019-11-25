import React from 'react';
import './App.css';

const SQUARE_SIZE = 20;
const DROP_INTERVAL = 1000; // ms
const COLORS = [
  null,     // Ignore first element due to array zero based index and numbers used in tetraminoes
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
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2],
  ],
  [ // J

    [0, 3, 0],
    [0, 3, 0],
    [3, 3, 0],
  ],
  [ // O
    [4, 4],
    [4, 4],
  ],
  [ // S
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [ // Z
    [6, 6, 0],
    [0, 6, 6],
    [0, 0, 0],
  ],
  [ // T
    [0, 7, 0],
    [7, 7, 7],
    [0, 0, 0],
  ]
];

class App extends React.Component {
  constructor(props) {
    super(props);

    // bind 'this' in the handleKeyPress function so that the keywork is actually connected to this class.
    // if we do not bind this keyword, console.log(this) will return undefined or the document
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.x = 0;
    this.y = 0;
    this.currentPiece = TETRAMINOES[1];
  }

  componentDidMount() {
    // get reference to board canvas and its context
    this.board = this.refs.Board;
    this.ctx = this.board.getContext("2d");

    document.addEventListener("keydown", this.handleKeyPress, false);

    this.updateCanvas();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  render() {  
    return (
      <div className="App">
        <h1>CanvaTris</h1>
        <canvas ref="Board" className="Board" width={200} height={400}/>
      </div>
    );
  }

  handleKeyPress(event) {
    //console.log("pressed ", event.code, event.keyCode);
    switch (event.keyCode) {
      case 37: // left
        this.movePiece(-1);
        break;

      case 39: // right
        this.movePiece(1);
        break;
        
      case 40: // down
        this.dropPiece()
        break;
        
      case 38: // up
        this.rotatePiece();
        break;
    }
  }

  movePiece(direction) {
    this.x += direction;
    this.updateCanvas();
  }

  dropPiece() {
    this.y += 1;
    this.updateCanvas();
  }

  rotatePiece(dir = 1) {
    for (let y = 0; y < this.currentPiece.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          this.currentPiece[x][y],
          this.currentPiece[y][x],
        ] = [
          this.currentPiece[y][x],
          this.currentPiece[x][y],
        ];
      }
    }

    if (dir > 0) {
      this.currentPiece.forEach(row => row.reverse());
    } else {
      this.currentPiece.reverse();
    }
    this.updateCanvas();
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
    this.drawPiece(this.x, this.y, 1);
  }

  drawPiece(xOffset, yOffset) {
    const t = this.currentPiece;
    t.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.drawSquare(x + xOffset, y + yOffset, COLORS[value]);
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
