import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'

export default class Grid extends React.Component {
  static propTypes = {
    h: PropTypes.number,
    len: PropTypes.number,
    scale: PropTypes.func,
    gridType: PropTypes.oneOf(['x', 'y']),
    className: PropTypes.string,
    style: PropTypes.object,
    ticks: PropTypes.number
  }
  constructor (props) {
    super(props)
    this.renderGrid = this.renderGrid.bind(this)
  }
  componentDidUpdate () { this.renderGrid() }
  componentDidMount () { this.renderGrid() }
  renderGrid () {
    switch (this.props.gridType) {
      case 'y':
        this.grid = axisLeft()
                    .scale(this.props.scale)
                    .ticks(this.props.ticks)
                    .tickSize(-this.props.len, 0, 0)
                    .tickFormat('')
        break
      case 'x':
      default:
        this.grid = axisBottom()
                    .scale(this.props.scale)
                    .ticks(this.props.ticks)
                    .tickSize(-this.props.len, 0, 0)
                    .tickFormat('')
    }

    var node = ReactDOM.findDOMNode(this)
    select(node).call(this.grid)
  }
  render () {
    var translate = 'translate(0,' + (this.props.h) + ')'
    return (
      <g
        className={this.props.className}
        style={this.props.style}
        transform={this.props.gridType === 'x' ? translate : ''} />
    )
  }
};
