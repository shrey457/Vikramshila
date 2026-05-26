import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const Layout = ({ children, mode, toggleColorMode }: LayoutProps) => {
  const location = useLocation();
  const isCoursePlayer = location.pathname.startsWith('/course/');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      {!isCoursePlayer && <Navbar mode={mode} toggleColorMode={toggleColorMode} />}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
      {!isCoursePlayer && <Footer />}
    </Box>
  );
};

export default Layout;
