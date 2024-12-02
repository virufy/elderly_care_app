import React from 'react';
import loadable from '@loadable/component';
import {
  Switch, Route, Redirect, useLocation,
} from 'react-router-dom';

// Components
import FullWidth from 'components/FullWidthDiv';
import Header, { HeaderContextProvider } from 'components/Header';
import FooterReportProblems from 'components/FooterReportProblems';
import FooterInstallAsApp from 'components/FooterInstallAsApp';

// Styles
import { AppContainer } from './style';

const AsyncLoad = loadable(({ container }: { container: string }) => import(`containers/${container}`), {
  fallback: <div>Loading ...</div>,
});

declare global {
  interface Window {
    sourceCampaign?: string | null;
  }
}

const App = () => {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    // Debug the current path and search parameters
    console.log('Current Path:', pathname);
    console.log('Search Params:', search);

    const params = new URLSearchParams(search);
    window.sourceCampaign = params.get('utm_campaign');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return (
    <AppContainer>
      <HeaderContextProvider>
        <Header />
        <FullWidth style={{ flex: 1 }}>
          <Switch>
            <Route path="/elderlycare/welcome">
              {console.log('Matched Route: /elderlycare/welcome')}
              <AsyncLoad key="Welcome" container="Welcome" />
            </Route>
            <Route path="/elderlycare/submit-steps">
              {console.log('Matched Route: /elderlycare/submit-steps')}
              <AsyncLoad key="SubmitSteps" container="SubmitSteps" />
            </Route>
            <Redirect exact from="/" to={{ pathname: '/elderlycare/welcome', search }} />
            <Redirect exact from="/elderlycare" to={{ pathname: '/elderlycare/welcome', search }} />
            <Route>
              {console.log('Fallback Route: 404 Page')}
              <div>404 Page Testing {pathname}</div>
            </Route>
          </Switch>
        </FullWidth>
        <FooterInstallAsApp />
        {(!pathname.includes('/submit-steps/thank-you')) && (!pathname.includes('/welcome/step-3')) && (!pathname.includes('/welcome')) && <FooterReportProblems /> }
      </HeaderContextProvider>
    </AppContainer>
  );
};

export default App;
