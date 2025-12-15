import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import CreateAccount from '../pages/CreateAccount';
import ViewPlans from '../pages/ViewPlans';
import PlanEvent from '../pages/PlanEvent';
import CreatePlan from '../pages/CreatePlan';
import Team from '../pages/Team';

import ScrollToHash from '../components/ScrollToHash';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/viewplans" element={<ViewPlans />} />
        <Route path="/createplan" element={<CreatePlan />} />

        <Route path="/planevent/:eventId" element={<PlanEvent />} />
      </Routes>
    </BrowserRouter>
  );
}
