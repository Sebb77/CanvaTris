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

class Player {
  pos = {x: 0, y: 0};
  currentPiece = null;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    // bind 'this' in the handleKeyPress function so that the keywork is actually connected to this class.
    // if we do not bind this keyword, console.log(this) will return undefined or the document
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);

    this.resetGame();
  }

  componentDidMount() {
    // get reference to board canvas and its context
    this.board = this.refs.Board;
    this.ctx = this.board.getContext("2d");

    document.addEventListener("keydown", this.handleKeyPress, false);

    this.newPiece();
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

  resetGame() {
    this.dropCounter = 0;
    this.lastTime = 0;
    this.arena = this.createMatrix(10, 20);
    
    this.player = new Player();
    this.newPiece();
  }

  createMatrix(w, h) {
    const matrix = [];
    while (h--)
      matrix.push(new Array(w).fill(0));
    return matrix;
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

      default:
    }
  }
  
  checkLines() {
    const arena = this.arena;

    // check for completed lines
    for (let y = arena.length -1; y > 0; --y) {
      let exitLoop = false;
      for (let x = 0; x < arena[y].length; ++x) {
          if (arena[y][x] === 0) {
            exitLoop = true;
            continue;
          }
      }

      if (exitLoop) {
        continue;
      } else {
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
      }
    }
  }

  movePiece(direction) {
    this.player.pos.x += direction;
    if (this.collide()) {
      this.player.pos.x -= direction;
    }
  }

  dropPiece() {
    this.player.pos.y++;
    if (this.collide()) {
      this.player.pos.y--;
      this.merge();
      this.checkLines();
      this.newPiece();
    }
    this.dropCounter = 0;
  }

  rotatePiece(dir = 1) {
    const currPiece = TETRAMINOES[this.player.currentPiece];

    for (let y = 0; y < currPiece.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          currPiece[x][y],
          currPiece[y][x],
        ] = [
          currPiece[y][x],
          currPiece[x][y],
        ];
      }
    }

    if (dir > 0) {
      currPiece.forEach(row => row.reverse());
    } else {
      currPiece.reverse();
    }
  }

  updateCanvas(time = 0) {
    const deltaTime = time - this.lastTime;
    this.dropCounter += deltaTime;

    if (this.dropCounter > DROP_INTERVAL) {
      this.dropPiece();
      // console.clear();
      // console.table(this.arena);
    }
    
    this.lastTime = time;

    this.drawBoard();
    this.drawMatrix(this.arena, {x: 0, y: 0});
    this.drawPiece(this.player.pos, this.player.pos, 1);
    
    requestAnimationFrame(this.updateCanvas);
  }

  collide() {
    const arena = this.arena;
    const piece = TETRAMINOES[this.player.currentPiece];
    const pos = this.player.pos;

    for (let y = 0; y < piece.length; ++y) {
        for (let x = 0; x < piece[y].length; ++x) {
            if (piece[y][x] !== 0 &&
               (arena[y + pos.y] &&
                arena[y + pos.y][x + pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
  }

  merge() {
    const player = this.player;

    TETRAMINOES[player.currentPiece].forEach((row, y) => {
      row.forEach((value, x) => {
          if (value !== 0) {
              this.arena[y + player.pos.y][x + player.pos.x] = value;
          }
      });
    });
  }

  newPiece() {
    const player = this.player;
    
    // Give random piece to player
    player.currentPiece = (TETRAMINOES.length * Math.random() | 0);

    // Initialize position to top/center of arena
    player.pos.y = 0;
    player.pos.x = (this.arena[0].length / 2 | 0) - (TETRAMINOES[player.currentPiece].length / 2 | 0);

    // if we have a collision when creating a new piece, it means that we have reached the top of the arena
    if (this.collide()) {
      // game over!!!
      this.resetGame();
    }
  }

  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.drawSquare(x + offset.x, y + offset.y, value);
        }
      });
    });
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

  drawPiece(offset) {
    const t = TETRAMINOES[this.player.currentPiece];
    t.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.drawSquare(x + offset.x, y + offset.y, value);
        }
      });
    });
  }

  drawSquare(x, y, color) {
    this.ctx.fillStyle = COLORS[color];
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
