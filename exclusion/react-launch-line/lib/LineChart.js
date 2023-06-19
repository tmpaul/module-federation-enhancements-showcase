function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { bisector, extent } from 'd3-array';
import * as d3Shape from 'd3-shape';
import { Motion, spring } from 'react-motion';
import Axis from './Axis';
import Gradient from './Gradient';
import Grid from './Grid';
let {
  line,
  area,
  curveCardinal
} = d3Shape;

function createBisectorWithAccessor(key) {
  return bisector(function (d) {
    return key ? d[key] : d;
  }).left;
}

const PROP_TYPES = {
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  bkgColor: PropTypes.string,
  curve: PropTypes.string,
  yData: PropTypes.string,
  yUnitLabel: PropTypes.string,
  xData: PropTypes.string,
  data: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  titleStyle: PropTypes.object,
  titleClass: PropTypes.string,
  lineColor: PropTypes.string,
  xTickFormat: PropTypes.string,
  gradientColor: PropTypes.string,
  showGradient: PropTypes.bool,
  alwaysTooltip: PropTypes.bool,
  containerStyle: PropTypes.object,
  yDomain: PropTypes.array,
  onTooltipChange: PropTypes.func,
  style: PropTypes.object,
  id: PropTypes.string
};
const DEFAULT_PROPS = {
  barWidth: 40,
  barPadding: 8,
  margin: {
    left: 32,
    bottom: 20,
    top: 5,
    right: 15
  },
  height: 170,
  width: 400,
  id: 'launch-linechart',
  curve: 'curveLinear',
  lineColor: '#0288d1',
  gradientColor: '#0288d1',
  showGradient: true,
  parseString: '%Y-%m-%d',
  xTickFormat: '%m-%d',
  xData: 'date',
  yData: 'value',
  bkgColor: '#263238',
  max: 100,
  data: [],
  duration: 500
};
/**
 * < HOC >
 *   Loops through data prop and overwrites xData key
 *   with properly parsed date object
 */

function parsedChart(Chart) {
  return class extends React.Component {
    static propTypes = {
      data: PROP_TYPES['data'],
      parseString: PropTypes.string,
      xData: PROP_TYPES['xData']
    };
    static defaultProps = DEFAULT_PROPS;

    render() {
      let parseDate = this.parse = timeParse(this.props.parseString);
      return /*#__PURE__*/React.createElement(Chart, _extends({}, this.props, {
        data: this.props.data.map(d => ({ ...d,
          [this.props.xData]: parseDate(d[this.props.xData])
        }))
      }));
    }

  };
}

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: {}
    };
    this.createChart = this.createChart.bind(this);
    this.showToolTip = this.showToolTip.bind(this);
    this.toolTipOn = this.toolTipOn.bind(this);
    this.toolTipOff = this.toolTipOff.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this._onTooltipChange = this._onTooltipChange.bind(this);
  }

  static propTypes = PROP_TYPES;

  componentDidUpdate(lastProps, lastState) {
    if (this.state.tooltipKey !== lastState.tooltipKey) {
      this._onTooltipChange();
    }
  }

  _onTooltipChange() {
    if (this.props.onTooltipChange && typeof this.props.onTooltipChange === 'function') {
      this.props.onTooltipChange(this.state.tooltip.data);
    }
  }

  createChart() {
    let {
      height,
      width,
      curve,
      margin,
      yDomain,
      yData,
      xData,
      data
    } = this.props;
    this.format = timeFormat('%Y-%m-%d');
    let dCurve = this.curve = this.getCurve(curve);
    let ext = this.extent = extent(data, d => d[yData]);
    let domainExt = this.domainExt = extent(data, d => d[xData]);
    let chartWidth = this.chartWidth = width - margin.left - margin.right;
    let chartHeight = this.chartHeight = height - margin.top - margin.bottom; // Create the Domain Scale function

    let x = this.xScale = scaleTime().domain(domainExt).range([0, chartWidth]); // Create the Range Scale function

    let y = this.yScale = scaleLinear().domain(yDomain || [0, ext[1]]).range([chartHeight, margin.top]); // Create the main Line  path definition

    let theLine = this.line = line().x(function (d, i) {
      return x(d[xData]);
    }).y(function (d) {
      return y(d[yData]);
    }).curve(dCurve); // Create the Gradient Area path definition

    let theArea = this.area = area().curve(dCurve).x((d, i) => {
      return x(d[xData]);
    }).y0(chartHeight).y1(d => {
      return y(d[yData]);
    });
    return {
      x,
      y,
      line: theLine,
      area: theArea
    };
  }

  handleMouseOver(e) {
    if (this.props.alwaysTooltip) {
      this.toolTipOn();
    }

    this.obj = document.querySelector('#' + this.props.id);
    this.boundingRect = this.obj.getBoundingClientRect(); // console.log('MouseOver!');
  }

  handleMouseOut(e) {
    this.toolTipOff(); // console.log('Mouse Out!');
  }

  handleMouseMove(e) {
    // console.log('MouseMove!');
    let tooltipX, x0, i, d0, d1, d;
    tooltipX = e.pageX - (this.boundingRect.left + this.props.margin.left);
    x0 = this.xScale.invert(tooltipX); // console.log(x0);

    let bisector = createBisectorWithAccessor(this.props.xData);
    i = bisector(this.props.data, x0, 1); // console.log(i);

    if (i >= this.props.data.length) {
      i = this.props.data.length - 1;
    }

    d0 = this.props.data[i - 1];
    d1 = this.props.data[i];

    if (!d0 && !d1) {
      // If there is no data, do nothing
      return;
    }

    if (!d0) {
      d = d1;
    } else {
      d = x0 - d0[this.props.xData] > d1[this.props.xData] - x0 ? d1 : d0;
    }

    this.setState({
      tooltipKey: d[this.props.xData],
      tooltip: {
        display: true,
        pos: {
          x: this.xScale(d[this.props.xData]),
          y: this.yScale(d[this.props.yData])
        },
        data: {
          key: d[this.props.xData],
          value: d[this.props.yData]
        }
      }
    });
  }

  toolTipOn() {
    this.setState({
      tooltip: {
        display: true,
        ...this.state.tooltip
      }
    });
  }

  toolTipOff() {
    this.setState({
      tooltip: { ...this.state.tooltip,
        display: false
      }
    });
  }

  showToolTip(e) {
    e.target.setAttribute('fill', '#FFFFFF');
    this.setState({
      tooltip: {
        display: true,
        data: {
          key: e.target.getAttribute('data-key'),
          value: e.target.getAttribute('data-value')
        },
        pos: {
          x: e.target.getAttribute('cx'),
          y: e.target.getAttribute('cy')
        }
      }
    });
  }

  hideToolTip(e) {
    e.target.setAttribute('fill', '#7dc7f4');
    this.setState({
      tooltip: {
        display: false,
        data: {
          key: '',
          value: ''
        }
      }
    });
  }

  getCurve(curve) {
    return d3Shape[curve] ? d3Shape[curve] : curveCardinal;
  }

  render() {
    let {
      height,
      width,
      containerStyle,
      margin,
      style,
      title,
      titleStyle,
      titleClass,
      yUnitLabel,
      lineColor,
      showGradient,
      gradientColor,
      data,
      bkgColor
    } = this.props;
    let {
      tooltip
    } = this.state;
    let {
      pos
    } = tooltip;
    this.createChart();
    let gradientDef = showGradient ? /*#__PURE__*/React.createElement(Gradient, {
      color1: bkgColor,
      color2: gradientColor,
      id: this.props.id + '_area'
    }) : null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: width,
        ...containerStyle
      },
      ref: 'wrap'
    }, /*#__PURE__*/React.createElement("div", {
      className: titleClass,
      style: Object.assign({}, !titleClass && {
        background: bkgColor,
        padding: '4px 12px',
        color: 'white',
        fontSize: 16
      }, titleStyle)
    }, title), /*#__PURE__*/React.createElement("svg", {
      id: this.props.id,
      onMouseOver: this.handleMouseOver,
      onMouseMove: this.handleMouseMove,
      onMouseOut: this.handleMouseOut,
      width: width,
      height: height,
      style: {
        background: bkgColor,
        ...style
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: "clip"
    }, /*#__PURE__*/React.createElement("rect", {
      width: width,
      height: height
    })), gradientDef), /*#__PURE__*/React.createElement("text", {
      y: margin.top + 4,
      x: margin.left,
      style: {
        stroke: 'white'
      }
    }, yUnitLabel), /*#__PURE__*/React.createElement(Axis, _extends({
      style: {
        stroke: 'white'
      },
      orient: "left",
      scale: this.yScale,
      h: height,
      axisType: "y",
      className: "axis",
      ticks: 5
    }, this.props)), /*#__PURE__*/React.createElement(Axis, _extends({
      style: {
        stroke: '#FFF'
      },
      orient: "bottom",
      scale: this.xScale,
      h: height,
      axisType: "x",
      className: "axis",
      tickFormat: this.props.xTickFormat,
      ticks: 5
    }, this.props)), /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + margin.left + ',' + margin.top + ')'
    }, /*#__PURE__*/React.createElement(Grid, _extends({
      h: this.chartHeight,
      len: this.chartWidth,
      ticks: 5,
      scale: this.yScale,
      className: "grid",
      gridType: "y"
    }, this.props)), /*#__PURE__*/React.createElement(Motion, {
      defaultStyle: {
        x: 0,
        y: 0
      },
      style: {
        x: spring(pos ? pos.x : 0),
        y: spring(pos ? pos.y : 0)
      }
    }, interpolatingStyle => {
      return !tooltip.display ? null : /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
        style: {
          zIndex: 299
        },
        d: 'M' + interpolatingStyle.x + ',' + 0 + ' V ' + this.chartHeight,
        strokeWidth: '1px',
        stroke: "#aaa"
      }), /*#__PURE__*/React.createElement("path", {
        style: {
          zIndex: 299
        },
        d: 'M' + 0 + ',' + interpolatingStyle.y + ' H ' + width,
        strokeWidth: '1px',
        stroke: "#aaa"
      }));
    }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: this.line(data),
      stroke: lineColor,
      strokeWidth: '3px',
      strokeLinecap: 'round',
      fill: 'none'
    }), /*#__PURE__*/React.createElement("path", {
      d: this.area(data),
      id: 'area2',
      fill: 'url(#' + this.props.id + '_area' + ')'
    })))));
  }

}

export default parsedChart(LineChart);