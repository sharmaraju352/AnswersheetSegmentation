import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Canvas from './Canvas';

class CanvasContainer extends React.Component {
  /* MouseEvent section */

  isMouseDown = false;

  onMouseDown = ({ nativeEvent: { offsetX: x, offsetY: y } }) => {
    this.isMouseDown = true;

    this.canvas.drawDot({ x, y });
    this.canvas.connectLine({ x, y });
  };

  onMouseMove = ({ nativeEvent: { offsetX: x, offsetY: y } }) => {
    if (!this.isMouseDown) return;

    this.canvas.connectLine({ x, y });
  };

  onMouseUp = () => {
    this.isMouseDown = false;

    this.canvas.closeLine();
  };
  onMouseOut = () => this.isMouseDown && this.onMouseUp();

  /* TouchEvent section */

  onTouchStart = ({ nativeEvent }) => {
    console.log('onTouchStart');
  };

  onTouchCancel = () => {
    console.log('onTouchCancel');

    this.canvas.closeLine();
  };

  onTouchEnd = () => {
    console.log('onTouchEnd');

    this.canvas.closeLine();
  };

  render() {
    const { width, height, background } = this.props;
    return (
      <div style={{ width, height }}>
        <img src={background} width="460" height="500" />
        <Canvas
          ref={instance => (this.canvas = instance)}
          penColor={this.props.penColor}
          penWidth={this.props.penWidth}
          mode={this.props.mode}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseOut={this.onMouseOut}
          onTouchStart={this.onTouchStart}
          onTouchCancel={this.onTouchCancel}
          onTouchEnd={this.onTouchEnd}
        />
      </div>
    );
  }
}
CanvasContainer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  background: PropTypes.src
};

const mapStateToProps = (state, ownProps) => {
  return {
    penColor: state.drawing.pen.color,
    penWidth: state.drawing.pen.width,
    mode: state.drawing.mode,

    //for touch offset scaling
    canvasZoom: state.game.canvasZoom
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({});

CanvasContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasContainer);
export default CanvasContainer;
