import React, { useEffect } from 'react';
import Main from './containers/Main';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthOnLoad } from './api/auth';
import Spinner from './components/Spinner';
import IStore from './store/IStore';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8B131D'
    },
    secondary: {
      main: '#696969'
    }
  }
})

function App() {
  const dispatch = useDispatch();
  const loading = useSelector<IStore, boolean>(state => state.loading);
  useEffect(() => {
    dispatch({type: 'SIGN_IN', payload: checkAuthOnLoad()});
  }, [dispatch])
  return <ThemeProvider theme={theme}><Main />{loading && <div className="loading"><Spinner/></div>}</ThemeProvider>;
}

export default App;
