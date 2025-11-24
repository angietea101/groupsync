import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<h2>Sign In Page</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
