import React, {Component} from 'react';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import Analytics from './pages/Dashboard/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import {
  createInstance, OptimizelyFeature,
  OptimizelyProvider,
  useDecision, withOptimizely,
} from '@optimizely/react-sdk';
import buttons from "./pages/UiElements/Buttons";

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  const preloader = document.getElementById('preloader');
  const optimizely = createInstance({
    sdkKey: 'VWNtKMX62Sai8YQP6w1Ji'
  })

  class PurchaseButton extends Component<any, any> {
    onClick = () => {
      const {optimizely} = this.props;
      optimizely.track('purchase')
    }

    render() {
      return (
          <button
              onClick={this.onClick}
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
              type="submit"
              style={{marginLeft: "10px"}}
          >
            Collect
          </button>
      )
    }
  }

  const WrappedPurchaseButton = withOptimizely(PurchaseButton);

  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none';
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <p className=" text-center text-danger">Failed to lead app</p>
  ) : (
    <>
      <OptimizelyProvider
          optimizely={optimizely}
          user={{ id: 'default_user' }}
      >
        <OptimizelyFeature feature="discount">
          {(enabled, variables) => {
            return (
                <div style={{display: "flex", alignItems:"center", justifyContent:"center", margin: "10px 0"}}>
                  Win a discount of ${variables.amount}
                  <WrappedPurchaseButton></WrappedPurchaseButton>
                </div>
            )
          }
          }
        </OptimizelyFeature>

        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/ui/alerts" element={<Alerts />} />
          <Route path="/ui/buttons" element={<Buttons />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
        </Routes>
      </OptimizelyProvider>

    </>
  );
}

export default App;
