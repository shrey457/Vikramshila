import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EXAMS } from '../data/catalog';
import { useStore } from '../store/useStore';

const SelectExam = () => {
  const navigate = useNavigate();
  const setPreferredExam = useStore(state => state.setPreferredExam);

  const handleSelectExam = (examId: string) => {
    setPreferredExam(examId);
    navigate(`/exam/${examId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            mb: 2
          }}
        >
          Choose Your Exam
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWith: 600, mx: 'auto', fontWeight: 400 }}
        >
          Select your goal to customize your dashboard with curated, high-quality learning playlists.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {EXAMS.map((exam) => (
          <Grid key={exam.id} size={{ xs: 12, sm: 6 }}>
            <Card 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s', 
                '&:hover': { 
                  transform: 'translateY(-6px)',
                  borderColor: 'primary.main',
                  boxShadow: '0 12px 24px rgba(99,102,241,0.15)'
                },
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderRadius: 4
              }}
              elevation={0}
            >
              <CardActionArea 
                onClick={() => handleSelectExam(exam.id)} 
                sx={{ height: '100%', p: 3, textAlign: 'left' }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    {exam.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {exam.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SelectExam;
