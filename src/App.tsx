import React, { useEffect } from 'react';
import Main from './containers/Main';
import { fetchEntries } from './actions/EntryActions';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch<any>(fetchEntries('A'))
    .then((data: any) => console.log('DATA:', data))
    .catch((error: Error) => console.log(error));
  })
  return (
    <Main />
  );
}

export default App;
