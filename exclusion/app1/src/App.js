import React from 'react';


const RemoteLineChart = React.lazy(() => import('app2/LineChart'));
const App = () => (
  
  <div>
    <h1>Basic Host-Remote</h1>
    <h2>App 1</h2>
    <React.Suspense fallback="Loading Remote Select">
      <RemoteLineChart />
    </React.Suspense>
  </div>
);

export default App;
