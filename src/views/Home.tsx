import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  CardActionArea,
  useTheme,
} from '@mui/material';
import {
  TrackChanges,
  AutoStories,
  OfflineBolt,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { EXAMS } from '../data/catalog';
import { useStore } from '../store/useStore';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const preferredExam = useStore(state => state.preferredExam);

  const handleStartLearningClick = () => {
    if (preferredExam) {
      navigate(`/exam/${preferredExam}`);
    } else {
      navigate('/select-exam');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 16 }, textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 800, 
            fontSize: { xs: '2.75rem', md: '4.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            mb: 3
          }}
        >
          Your Personal Learning Hub for <Box component="span" sx={{ color: 'primary.main' }}>Competitive Exams</Box>
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 6, maxWidth: 600, mx: 'auto', fontWeight: 400, fontSize: '1.25rem' }}
        >
          Organize YouTube lectures into structured courses. Track your progress, stay focused, and master JEE, NEET, and CAT.
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleStartLearningClick}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            disableElevation
          >
            Start Learning Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="https://github.com/shrey457/Vikramshila"
            target="_blank"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            View on GitHub
          </Button>
        </Stack>
      </Container>

      {/* Value Prop Section */}
      <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {[
              { icon: <TrackChanges fontSize="large" color="primary" />, title: 'Course Tracking', desc: 'Mark videos as complete and visualize your journey across any YouTube playlist.' },
              { icon: <AutoStories fontSize="large" color="primary" />, title: 'Curated Content', desc: 'Pre-structured modules for major exams designed by top educators.' },
              { icon: <OfflineBolt fontSize="large" color="primary" />, title: 'Private & Local', desc: 'All your progress stays in your browser. No account, no tracking, just learning.' },
            ].map((feature, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: 4, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Exam Catalog Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2 }}>
          Popular Exam Modules
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 8, fontSize: '1.1rem' }}>
          Kickstart your preparation with our featured curated collections.
        </Typography>
        <Grid container spacing={4}>
          {EXAMS.map((exam) => (
            <Grid key={exam.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  transition: '0.3s', 
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                  },
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  backgroundImage: 'none'
                }}
                elevation={0}
              >
                <CardActionArea component={Link} to={`/exam/${exam.id}`} sx={{ height: '100%', p: 3 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                      {exam.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {exam.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
