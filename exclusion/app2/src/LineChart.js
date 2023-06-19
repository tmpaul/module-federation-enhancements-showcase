import React from 'react';
import {min} from 'd3-array';
import { LineChart } from 'tmpaul-react-launch-line';

let data = [
  { value: 40, max: 50, color: 'red'},
  { value: 20, max: 50, color: 'blue'},
  { value: 30, max: 50, color: 'green'},
];

const MyAwesomeReactComponent = () => {
    return (
        <div>
            <h5>Min</h5>
            <p>{min(data, d => d.value)}</p>
            <LineChart title={'Points'} data={data} />
        </div>
    );
};

export default MyAwesomeReactComponent;
