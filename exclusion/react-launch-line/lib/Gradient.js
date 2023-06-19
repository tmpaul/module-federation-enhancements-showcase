import React from 'react';
import PropTypes from 'prop-types';
export default class Gradient extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    color1: PropTypes.string,
    color2: PropTypes.string
  };

  render() {
    return /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      is: true,
      id: this.props.id,
      x1: "0%",
      y1: "100%",
      x2: "0%",
      y2: "0%",
      spreadMethod: "pad"
    }, /*#__PURE__*/React.createElement("stop", {
      is: true,
      offset: "05%",
      "stop-color": this.props.color1,
      "stop-opacity": 0.4
    }), /*#__PURE__*/React.createElement("stop", {
      is: true,
      offset: "100%",
      "stop-color": this.props.color2,
      "stop-opacity": 1
    })));
  }

}