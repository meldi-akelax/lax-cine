import React, {useState, useEffect,  Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
/* icon */
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import {orange, deepOrange} from '@material-ui/core/colors';

import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import Header from './components/Header';

const Home = React.lazy(() => import('./pages/home/Home'));
const Liste = React.lazy(() => import('./pages/liste/Liste'));


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

function LinearBuffer() {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
    </div>
  );
}


function App() {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false )

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary: deepOrange,
          secondary: orange,
        },
      }),
    [darkMode],
  );

  useEffect(() => {
    localStorage.setItem('darkMode',JSON.stringify(darkMode));
  }, [darkMode])
  
const sections = [
  { title: 'action', url: '/liste-action' },
  { title: 'serie', url: '#' },
  { title: 'comedie', url: '#' },
  { title: 'cinéma', url: '#' },
  { title: 'tout', url: '#' },
];

const handleColorMode = ()=> setDarkMode(!darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header title="Lax-ciné" sections={sections} handleColorMode={handleColorMode} colorModeIcon={ darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}/>
        
      <Router>
        <Suspense fallback={<LinearBuffer/>}>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route exact path="/liste-:category">
              <Liste/>
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;