import Header from './components/navbar/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CurrentPeriod from './components/period/CurrentPeriod';
import Employees from './components/employees/Employees';
import History from './components/history/History';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/employee/:id" component={History} />
        <Route path="/employees" component={Employees} />
        <Route path="/" component={CurrentPeriod} />
      </Switch>
    </Router>
  );
};

export default App;
