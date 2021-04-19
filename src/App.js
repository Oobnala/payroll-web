import Header from './components/navbar/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CurrentPeriod from './components/period/CurrentPeriod';
import Employees from './components/employees/Employees';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/employees" component={Employees} />
        <Route path="/" component={CurrentPeriod} />
      </Switch>
    </Router>
  );
}

export default App;
