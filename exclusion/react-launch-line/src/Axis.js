import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { axisTop, axisBottom, axisLeft, axisRight } from 'd3-axis'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'

export default class Axis extends Component {
  static propTypes = {
    h: PropTypes.number,
    scale: PropTypes.func,
    axisType: PropTypes.oneOf(['x', 'y']),
    orient: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
    className: PropTypes.string,
    tickFormat: PropTypes.string,
    ticks: PropTypes.number,
    margin: PropTypes.object,
    style: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.renderAxis = this.renderAxis.bind(this)
  }
  componentDidUpdate () { this.renderAxis() }
  componentDidMount () { this.renderAxis() }
  renderAxis () {
    let _self = this
    switch (this.props.axisType) {
      case 'x':
        if (this.props.orient === 'top') {
          this.axis = axisTop()
                        .scale(this.props.scale)
                        .ticks(this.props.ticks, 's')
        } else if (this.props.orient === 'bottom') {
          this.axis = axisBottom()
                            .scale(this.props.scale)
                            .ticks(this.props.ticks, 's')
        }
        break
      case 'y':
      default:
        if (this.props.orient === 'left') {
          this.axis = axisLeft()
                        .scale(this.props.scale)
                        .ticks(this.props.ticks, 's')
        } else if (this.props.orient === 'right') {
          this.axis = axisRight()
                            .scale(this.props.scale)
                            .ticks(this.props.ticks, 's')
        }
    }

    if ((this.props.tickFormat) && this.props.axisType === 'x') {
      this.axis.tickFormat(timeFormat(this.props.tickFormat))
    }

    let node = ReactDOM.findDOMNode(this)
    if (_self.props.rotateText) {
      select(node).call(this.axis).selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '-.15em')
            .attr('transform', function (d) {
              return _self.props.rotateText ? 'rotate(' + _self.props.rotateText + ')' : ''
            })
    } else {
      select(node).call(this.axis)
    }
  }
  render () {
    let { style, className, margin, axisType, h } = this.props
    let translate = axisType === 'x'
                        ? `translate(${margin.left - 1}, ${h - margin.bottom})`
                        : `translate(${margin.left - 1}, ${margin.top})`

    return (
      <g className={className} style={style} transform={translate} />
    )
  }
}
