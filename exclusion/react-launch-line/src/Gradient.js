import React from 'react'
import PropTypes from 'prop-types'

export default class Gradient extends React.Component {
  static propTypes = {
    id:PropTypes.string,
    color1:PropTypes.string,
    color2:PropTypes.string
  }
  render () {
    return (
      <defs>
        <linearGradient is id={this.props.id} x1='0%' y1='100%' x2='0%' y2='0%' spreadMethod='pad'>
          <stop is offset='05%' stop-color={this.props.color1} stop-opacity={0.4} />
          <stop is offset='100%' stop-color={this.props.color2} stop-opacity={1} />
        </linearGradient>
      </defs>
    )
  }
}
