import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <DatesProvider settings={{}}>
        <BrowserRouter />
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
