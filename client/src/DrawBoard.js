import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';
import {Types} from './config';

import './DrawBoard.css';

const PADDING = 20;

class DrawBoard extends React.Component {
  componentDidMount() {
    this.canvas = this.refs.myCanvas;
    this.ctx = this.canvas.getContext('2d');

    this.prevX = 0;
    this.prevY = 0;
    this.currX = 0;
    this.currY = 0;

    this.ctx.strokeStyle = "black"
    this.ctx.lineWidth = 2;

    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));

    // For web
    this.canvas.addEventListener("mousedown", this.touch.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.release.bind(this))
    this.canvas.addEventListener("mouseout", this.release.bind(this))

    // For iOS safari
    this.canvas.addEventListener("touchstart", (ev) => {
      ev.preventDefault();
      this.touch(ev, true);
    });

    this.canvas.addEventListener("touchmove", (ev) => {
      ev.preventDefault();
      this.draw(ev, true);
    });

    this.canvas.addEventListener("touchend", (ev) => {
      ev.preventDefault();
      this.release(ev);
    });
  }

  resizeCanvas() {
    this.width = window.innerWidth - PADDING;
    this.canvas.width = window.innerWidth - PADDING;
    this.height = window.innerHeight - PADDING;
    this.canvas.height = window.innerHeight - PADDING;
  }

  preventDrag(ev) {
    ev.preventDefault();
  }

  setupCoords(ev) {
    this.prevX = this.currX;
    this.prevY = this.currY;

    const rect = this.canvas.getBoundingClientRect();
    this.currX = ev.clientX - rect.left;
    this.currY = ev.clientY - rect.top;
  }

  setupCoordsTouch(ev) {
    this.prevX = this.currX;
    this.prevY = this.currY;

    const rect = this.canvas.getBoundingClientRect();
    this.currX = ev.touches[0].clientX - rect.left;
    this.currY = ev.touches[0].clientY - rect.top;
  }

  touch(ev, isTouch) {
    if (isTouch) {
      this.setupCoordsTouch(ev);
    } else {
      this.setupCoords(ev);
    }

    this.mouseDown = true;

    if (this.enableDot) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(this.currX, this.currY, 2, 2);
      this.ctx.closePath();
    }
  }

  draw(ev, isTouch) {
    if (this.mouseDown) {
      if (isTouch) {
        this.setupCoordsTouch(ev);
      } else {
        this.setupCoords(ev);
      }

      this.ctx.beginPath();
      this.ctx.moveTo(this.prevX, this.prevY);
      this.ctx.lineTo(this.currX, this.currY);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  release(ev) {
    this.mouseDown = false;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  submit() {
    window.open(this.canvas.toDataURL());
    this.props.ws.send(JSON.stringify({
      type: Types.SEND_PHRASE_DATA,
      gameId: this.props.gameId,
      phrase: this.canvas.toDataURL(),
    }));
  }

  render() {
    return (
      <div className="DrawBoard">
        <Card>
            <canvas
              className="DrawCanvas"
              ref="myCanvas"
            />
          <RaisedButton
            label="Send Image"
            onClick={this.submit.bind(this)}
          />
          <RaisedButton
            label="Clear Canvas"
            onClick={this.clear.bind(this)}
          />
        </Card>
      </div>
    )
  }
}

export default DrawBoard;
