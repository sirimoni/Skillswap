import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import ProfilePublic from './pages/ProfilePublic';
import EditProfile from './pages/EditProfile';
import MySwaps from './pages/MySwaps';
import ChangePassword from './pages/ChangePassword';

const NotFound = () => (
  <div className="text-center py-24">
    <h1 className="text-6xl">404</h1>
    <p className="mt-2 text-foreground/60">That page doesn’t exist.</p>
    <Link to="/" className="mt-4 inline-block underline">Back to home</Link>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/u/:id" element={<ProfilePublic />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/swaps" element={<MySwaps />} />
          <Route path="/settings/password" element={<ChangePassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
