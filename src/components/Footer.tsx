import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  SvgIcon,
  type SvgIconProps,
} from '@mui/material';
import {
  GitHub,
} from '@mui/icons-material';

const DiscordIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 127.14 96.36">
    <path
      fill="currentColor"
      d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,71.43,71.43,0,0,1-10.5-5A57,57,0,0,0,31,78,75.68,75.68,0,0,0,96.11,78a57,57,0,0,0,2.83,2.5,71.43,71.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129.87,50.12,123.6,27.31,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"
    />
  </SvgIcon>
);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box component="footer" sx={{ py: 6, borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Vikramshila
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" align={isMobile ? 'center' : 'left'}>
              © {new Date().getFullYear()} Vikramshila. Built for learners.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <IconButton href="https://github.com/shrey457/Vikramshila" target="_blank" color="inherit"><GitHub /></IconButton>
              <IconButton href="https://discord.gg/7UNxfm7PqP" target="_blank" color="inherit"><DiscordIcon /></IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
