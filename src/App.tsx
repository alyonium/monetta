import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { BrowserRouter } from 'react-router';
import AppRouter from '@/router/AppRouter.tsx';

function App() {
  return (
    <MantineProvider
      defaultColorScheme='dark'
      theme={{
        primaryColor: 'indigo',
      }}
    >
      <DatesProvider settings={{}}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
