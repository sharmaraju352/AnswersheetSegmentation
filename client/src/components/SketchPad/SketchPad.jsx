import React from 'react';
import PropTypes from 'prop-types';
import CanvasContainer from './Canvas/CanvasContainer';

class SketchPad extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { background } = this.props;

    const canvas = {
      width: 500,
      height: 500
    };

    console.log('width: ', canvas.width);
    console.log('height: ', canvas.height);

    return (
      <CanvasContainer
        width={canvas.width}
        height={canvas.height}
        background={background}
      />
    );
  }
}
CanvasContainer.propTypes = {
  background: PropTypes.src
};
export default SketchPad;
