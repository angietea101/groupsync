import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import CreateAccount from '../pages/CreateAccount';
import ViewEvents from '../pages/ViewEvents';
import PlanEvent from '../pages/PlanEvent';
import CreatePlan from '../pages/CreatePlan';

import ScrollToHash from '../components/ScrollToHash';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/viewevents" element={<ViewEvents />} />
        <Route path="/createplan" element={<CreatePlan />} />

        <Route path="/planevent" element={<PlanEvent />} />
      </Routes>
    </BrowserRouter>
  );
}
