// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import MotionWrapper from './components/MotionWrapper';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <MotionWrapper>
              <Home />
            </MotionWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <MotionWrapper>
              <About />
            </MotionWrapper>
          }
        />
        <Route
          path="/projects"
          element={
            <MotionWrapper>
              <Projects />
            </MotionWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <MotionWrapper>
              <Contact />
            </MotionWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
