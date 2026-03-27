import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePagina from './pags/Home';
import LoginPagina from './pags/Login';
import TicketPagina from './pags/Ticket';

function RotaProtegida({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPagina />} />
        <Route path="/" element={
          <RotaProtegida><HomePagina /></RotaProtegida>
        } />
        <Route path="/ticket" element={
          <RotaProtegida><TicketPagina /></RotaProtegida>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
