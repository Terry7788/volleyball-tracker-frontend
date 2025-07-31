'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
  Stack,
  Tabs,
  Tab,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { SportsVolleyball, Refresh, Menu, Close } from '@mui/icons-material';
import { theme } from '@/theme/theme';
import ScoreBoard from '@/components/ScoreBoard';
import ScoreControls from '@/components/ScoreControls';
import CreateMatch from '@/components/CreateMatch';
import UserMenu from '@/components/UserMenu';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Match } from '@/types/match';
import { matchService } from '@/services/matchService';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const AppContent: React.FC = () => {
  const { loading: authLoading, getCurrentUserType, isAuthenticated, isGuest, guestSession } = useAuth();
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isLandscape = useMediaQuery('(orientation: landscape)');

  const loadMatches = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading matches for:', getCurrentUserType());
      
      const matches = await matchService.getAllMatches();
      console.log('Loaded matches:', matches.length);
      setAllMatches(matches);
      
      // Set current match to the most recent active match, or most recent match
      const activeMatch = matches.find(match => match.status === 'IN_PROGRESS');
      if (activeMatch) {
        setCurrentMatch(activeMatch);
        console.log('Set active match as current:', activeMatch.id);
      } else if (matches.length > 0) {
        setCurrentMatch(matches[0]);
        console.log('Set most recent match as current:', matches[0].id);
      } else {
        setCurrentMatch(null);
        console.log('No matches found');
      }
    } catch (error: unknown) {
      console.error('Error loading matches:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          setError('Session expired. Please refresh the page.');
        } else {
          setError('Unable to connect to the server. Please check if the backend is running.');
        }
      } else {
        setError('Unable to connect to the server. Please check if the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }, [getCurrentUserType]);

  // Load matches when auth state changes or when component mounts
  useEffect(() => {
    if (!authLoading && (isAuthenticated || isGuest)) {
      loadMatches();
    }
  }, [authLoading, isAuthenticated, isGuest, guestSession?.sessionId, loadMatches]);

  const handleMatchCreated = async (newMatch: Match): Promise<void> => {
    console.log('New match created:', newMatch.id);
    setCurrentMatch(newMatch);
    await loadMatches();
    setDrawerOpen(false);
  };

  const handleMatchUpdate = (updatedMatch: Match): void => {
    console.log('Match updated:', updatedMatch.id);
    setCurrentMatch(updatedMatch);
    setAllMatches(prev => 
      prev.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      )
    );
  };

  const selectMatch = async (matchId: number): Promise<void> => {
    try {
      console.log('Selecting match:', matchId);
      const match = await matchService.getMatchById(matchId);
      setCurrentMatch(match);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error loading match:', error);
    }
  };

  const activeMatches = allMatches.filter(match => match.status === 'IN_PROGRESS');
  const completedMatches = allMatches.filter(match => match.status === 'COMPLETED');

  // Match selector drawer content
  const MatchSelector = () => (
    <Box sx={{ width: 320, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          Matches
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* User type indicator */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Chip
          label={`${getCurrentUserType()} mode`}
          size="small"
          color={getCurrentUserType() === 'registered' ? 'primary' : 'default'}
          variant="outlined"
          sx={{ 
            fontSize: '0.7rem',
            textTransform: 'capitalize'
          }}
        />
        {isGuest && guestSession && (
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block',
            mt: 1,
            fontSize: '0.65rem'
          }}>
            Session expires: {new Date(guestSession.expiresAt).toLocaleString()}
          </Typography>
        )}
      </Box>

      {allMatches.length === 0 ? (
        <Box textAlign="center" py={4}>
          <SportsVolleyball sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body2" color="text.secondary" mb={3}>
            No matches yet
          </Typography>
          <CreateMatch onMatchCreated={handleMatchCreated} />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={selectedTab} 
              onChange={(_, newValue) => setSelectedTab(newValue)}
              aria-label="match categories"
              variant="fullWidth"
            >
              <Tab label={`Active (${activeMatches.length})`} />
              <Tab label={`Completed (${completedMatches.length})`} />
            </Tabs>
          </Box>

          <Stack spacing={2}>
            {(selectedTab === 0 ? activeMatches : completedMatches).map((match) => (
              <Card 
                key={match.id}
                variant="outlined"
                onClick={() => selectMatch(match.id)}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: currentMatch?.id === match.id ? 2 : 1,
                  borderColor: currentMatch?.id === match.id ? 'primary.main' : 'divider',
                  bgcolor: currentMatch?.id === match.id ? 'primary.50' : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                    {match.team1Name} vs {match.team2Name}
                  </Typography>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Sets: {match.team1Sets}-{match.team2Sets}
                    </Typography>
                    <Chip 
                      label={match.status === 'IN_PROGRESS' ? 'Live' : 'Completed'}
                      size="small"
                      color={match.status === 'IN_PROGRESS' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Stack>
                  
                  {match.status === 'IN_PROGRESS' && (
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Current: {match.team1Score}-{match.team2Score} (Set {match.currentSet})
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box mt={3}>
            <CreateMatch onMatchCreated={handleMatchCreated} />
          </Box>
        </>
      )}
    </Box>
  );

  // Show loading screen while auth is initializing
  if (authLoading || (loading && allMatches.length === 0)) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={48} sx={{ color: 'primary.main' }} />
          <Typography variant="body1" color="text.secondary">
            {authLoading ? 'Initializing...' : 'Loading volleyball tracker...'}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
        p={3}
      >
        <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <SportsVolleyball sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={loadMatches}
              startIcon={<Refresh />}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box bgcolor="background.default" minHeight="100vh">
      
      {/* Mobile Header with Hamburger Menu and User Menu */}
      {isMobile && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1100,
          p: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          {allMatches.length > 0 && (
            <IconButton 
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 400, flex: 1 }}>
            {currentMatch ? `${currentMatch.team1Name} vs ${currentMatch.team2Name}` : 'Volleyball Tracker'}
          </Typography>
          <UserMenu />
        </Box>
      )}

      {/* Desktop Header with User Menu */}
      {!isMobile && (
        <Box sx={{ 
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1100,
          p: 3
        }}>
          <UserMenu />
        </Box>
      )}

      {/* Hamburger Menu Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { bgcolor: 'background.default' }
        }}
      >
        <MatchSelector />
      </Drawer>

      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: isMobile ? 8 : 4,
          pb: isMobile && isLandscape ? 2 : 10
        }}
      >
        
        {/* Welcome State */}
        {allMatches.length === 0 && (
          <Box textAlign="center" py={8}>
            <Card elevation={0} sx={{ maxWidth: 500, mx: 'auto', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 6 }}>
                <SportsVolleyball sx={{ fontSize: 72, color: 'primary.main', mb: 3 }} />
                <Typography variant="h4" gutterBottom fontWeight={300} color="text.primary">
                  Welcome to Volleyball Tracker
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Track scores for volleyball matches with professional rules.
                  Best of 5 sets, with the 5th set played to 15 points.
                </Typography>
                
                {/* User type notice */}
                <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(34, 197, 94, 0.1)', borderRadius: 1, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {getCurrentUserType() === 'registered' 
                      ? 'Your matches will be saved permanently to your account'
                      : `Currently in guest mode - matches will be deleted after 24 hours`
                    }
                  </Typography>
                  {isGuest && guestSession && (
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      fontSize: '0.7rem',
                      display: 'block',
                      mt: 0.5
                    }}>
                      Session expires: {new Date(guestSession.expiresAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                
                <CreateMatch onMatchCreated={handleMatchCreated} />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Desktop Match Selector - Only show on desktop when multiple matches */}
        {!isMobile && allMatches.length > 1 && (
          <Card elevation={0} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={selectedTab} 
                  onChange={(_, newValue) => setSelectedTab(newValue)}
                  aria-label="match categories"
                >
                  <Tab label={`Active (${activeMatches.length})`} />
                  <Tab label={`Completed (${completedMatches.length})`} />
                </Tabs>
              </Box>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                {(selectedTab === 0 ? activeMatches : completedMatches).map((match) => (
                  <Card 
                    key={match.id}
                    variant="outlined"
                    onClick={() => selectMatch(match.id)}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: currentMatch?.id === match.id ? 2 : 1,
                      borderColor: currentMatch?.id === match.id ? 'primary.main' : 'divider',
                      bgcolor: currentMatch?.id === match.id ? 'primary.50' : 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      },
                      minWidth: 200,
                      maxWidth: 250,
                      flex: '1 1 auto'
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                        {match.team1Name} vs {match.team2Name}
                      </Typography>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          Sets: {match.team1Sets}-{match.team2Sets}
                        </Typography>
                        <Chip 
                          label={match.status === 'IN_PROGRESS' ? 'Live' : 'Completed'}
                          size="small"
                          color={match.status === 'IN_PROGRESS' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Stack>
                      
                      {match.status === 'IN_PROGRESS' && (
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          Current: {match.team1Score}-{match.team2Score} (Set {match.currentSet})
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Current Match Display */}
        {currentMatch && allMatches.length > 0 && (
          <>
            <ScoreBoard 
              match={currentMatch} 
              onMatchUpdate={handleMatchUpdate}
              isMobile={isMobile}
              isLandscape={isLandscape}
            />
            <ScoreControls 
              match={currentMatch} 
              onMatchUpdate={handleMatchUpdate}
              isMobile={isMobile}
              isLandscape={isLandscape}
            />
          </>
        )}

        {/* Desktop Create Match FAB */}
        {!isMobile && allMatches.length > 0 && <CreateMatch onMatchCreated={handleMatchCreated} />}
        
      </Container>
    </Box>
  );
};

export default function Home() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}