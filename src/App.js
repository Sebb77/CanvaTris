import React from 'react';
import './App.css';

class App extends React.Component {
  componentDidMount() {
    this.updateCanvs();
  }

  render() {  
    return (
      <div className="App">
        <h1>CanvaTris</h1>
        <canvas ref="Board" className="Board" width={200} height={400}/>
      </div>
    );
  }

  updateCanvs() {
    const ctx = this.refs.Board.getContext('2d');
    ctx.fillRect(0,0, 100, 100);
  }
}

export default App;
