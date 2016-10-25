import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import './DrawBoard.css';

class DrawBoard extends React.Component {
  componentDidMount() {
    this.ctx = this.refs.myCanvas.getContext('2d');
    const canvas = this.refs.myCanvas;

    this.canvas = canvas;

    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;

    this.width = canvas.width;
    this.height = canvas.height;

    canvas.addEventListener("mousedown", this.touch.bind(this));
    canvas.addEventListener("mousemove", this.draw.bind(this));
    canvas.addEventListener("mouseup", this.release.bind(this))
    canvas.addEventListener("mouseout", this.release.bind(this))
  }

  setupCoords(ev) {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = ev.clientX - this.canvas.getBoundingClientRect().left;
      this.currY = ev.clientY - this.canvas.getBoundingClientRect().top;
  }

  touch(ev) {
    this.setupCoords(ev);

    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.currX, this.currY, 2, 2);
    this.ctx.closePath();
  }

  draw(ev) {
    if (this.mouseDown) {
      this.setupCoords(ev);

      this.ctx.beginPath();
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(this.currX, this.currY);
      this.ctx.strokeStyle = "black"
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  release(ev) {
    this.mouseDown = false;
  }

  submit() {
    window.open(this.canvas.toDataURL());
  }

  render() {
    return (
      <div className="DrawBoard">
        <Card>
          <CardTitle title="Draw Board" subtitle="Sketch your stuff here!" />
          <RaisedButton
            label="Send Image"
            onClick={this.submit.bind(this)}
          />
          <RaisedButton
            label="Clear Canvas"
            onClick={this.clear.bind(this)}
          />
          <CardText>
            <canvas
              ref="myCanvas"
              style={{border:1, borderStyle:"dotted"}}
              width={500}
              height={500}
            />
          </CardText>
        </Card>
      </div>
    )
  }
}

export default DrawBoard;
