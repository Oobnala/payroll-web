import logo from './logo.svg';
import './App.css';
import 'fontsource-roboto';
import { Container } from '@material-ui/core';

import { MainCard } from './components/MainCard'
import { MainBar } from './components/MainBar'

function App() {
  return (
    <Container>
      <MainBar></MainBar>
      <MainCard></MainCard>
    </Container>
  );
}

export default App;
