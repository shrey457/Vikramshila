import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Button,
  Stack,
  Box,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getExamShortName } from '../utils/helpers';

interface NavbarProps {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const Navbar = ({ mode, toggleColorMode }: NavbarProps) => {
  const navigate = useNavigate();
  const preferredExam = useStore(state => state.preferredExam);

  const handleGetStartedClick = () => {
    if (preferredExam) {
      navigate(`/exam/${preferredExam}`);
    } else {
      navigate('/select-exam');
    }
  };

  return (
    <AppBar component="header" position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }} component={Link} to="/">
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Vikramshila
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Button color="inherit" component={Link} to="/dashboard" sx={{ display: { xs: 'none', sm: 'block' } }}>
              My Courses
            </Button>
            {preferredExam && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/select-exam')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Switch Goal
              </Button>
            )}
            <Button variant="contained" onClick={handleGetStartedClick} disableElevation>
              {preferredExam ? `${getExamShortName(preferredExam)} Prep` : 'Get Started'}
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
