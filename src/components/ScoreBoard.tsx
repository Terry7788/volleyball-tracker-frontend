import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Stack
} from '@mui/material';
import { Match } from '@/types/match';
import EditSet from './EditSet';

interface ScoreBoardProps {
  match: Match | null;
  onMatchUpdate?: (match: Match) => void;
  isMobile?: boolean;
  isLandscape?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  match, 
  onMatchUpdate, 
  isMobile = false, 
  isLandscape = false 
}) => {
  if (!match) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  const getSetDescription = (currentSet: number): string => {
    if (currentSet === 5) return `Set ${currentSet} • First to 15`;
    return `Set ${currentSet} • First to 25`;
  };

  const isWinning = (score1: number, score2: number): 'team1' | 'team2' | 'tie' => {
    if (score1 === score2) return 'tie';
    return score1 > score2 ? 'team1' : 'team2';
  };

  const currentSetWinner = isWinning(match.team1Score, match.team2Score);
  const overallWinner = isWinning(match.team1Sets, match.team2Sets);

  // Mobile landscape layout - full screen scoreboard
  if (isMobile && isLandscape) {
    return (
      <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Compact status bar */}
        <Box textAlign="center" py={1}>
          <Typography variant="caption" color="text.secondary" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            fontSize: '0.6rem'
          }}>
            {getSetDescription(match.currentSet)}
            {match.status === 'COMPLETED' && (
              <Chip 
                label="COMPLETED" 
                size="small" 
                sx={{ 
                  ml: 1, 
                  bgcolor: 'transparent', 
                  color: 'text.secondary',
                  border: '1px solid #404040',
                  fontSize: '0.6rem',
                  height: 20
                }} 
              />
            )}
          </Typography>
        </Box>

        {/* Landscape Scoreboard - Takes most of the screen */}
        <Card elevation={0} sx={{ flex: 1 }}>
          <CardContent sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center',
            p: 2
          }}>
            
            <Stack 
              direction="row"
              spacing={3}
              alignItems="center"
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              
              {/* Team 1 - Compact */}
              <Box textAlign="center" flex={1}>
                <Typography 
                  variant="subtitle1" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 400,
                    color: currentSetWinner === 'team1' ? 'primary.main' : 'text.secondary',
                    mb: 1,
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  {match.team1Name}
                </Typography>
                
                <Typography 
                  variant="h1" 
                  component="div" 
                  sx={{ 
                    fontSize: '4rem',
                    fontWeight: 100,
                    lineHeight: 0.8,
                    mb: 1,
                    color: currentSetWinner === 'team1' ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {match.team1Score}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem'
                }}>
                  Sets: <Box component="span" sx={{ 
                    color: overallWinner === 'team1' ? 'primary.main' : 'inherit' 
                  }}>{match.team1Sets}</Box>
                </Typography>
              </Box>

              {/* Compact Divider */}
              <Box 
                sx={{ 
                  width: '1px',
                  height: '80px',
                  bgcolor: 'divider'
                }} 
              />

              {/* Team 2 - Compact */}
              <Box textAlign="center" flex={1}>
                <Typography 
                  variant="subtitle1" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 400,
                    color: currentSetWinner === 'team2' ? 'secondary.main' : 'text.secondary',
                    mb: 1,
                    transition: 'color 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  {match.team2Name}
                </Typography>
                
                <Typography 
                  variant="h1" 
                  component="div" 
                  sx={{ 
                    fontSize: '4rem',
                    fontWeight: 100,
                    lineHeight: 0.8,
                    mb: 1,
                    color: currentSetWinner === 'team2' ? 'secondary.main' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {match.team2Score}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem'
                }}>
                  Sets: <Box component="span" sx={{ 
                    color: overallWinner === 'team2' ? 'secondary.main' : 'inherit' 
                  }}>{match.team2Sets}</Box>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Compact Set History for Landscape */}
        {match.sets && match.sets.length > 0 && (
          <Box py={1}>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              {match.sets.map((set) => (
                <Box 
                  key={set.id} 
                  sx={{ 
                    p: 1,
                    border: '1px solid #404040',
                    borderRadius: 1,
                    minWidth: 60,
                    bgcolor: 'transparent',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ 
                    fontSize: '0.6rem',
                    mb: 0.5
                  }}>
                    S{set.setNumber}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: set.team1Points > set.team2Points ? 'primary.main' : 
                           set.team2Points > set.team1Points ? 'secondary.main' : 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}>
                    {set.team1Points}-{set.team2Points}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Match Completed - Compact */}
        {match.status === 'COMPLETED' && (
          <Box textAlign="center" py={1}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 300, fontSize: '1rem' }}>
              {match.team1Sets > match.team2Sets ? match.team1Name : match.team2Name} wins
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Mobile portrait layout - more compact
  if (isMobile) {
    return (
      <Box maxWidth="600px" mx="auto">
        
        {/* Status */}
        <Box textAlign="center" mb={3}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {getSetDescription(match.currentSet)}
          </Typography>
          {match.status === 'COMPLETED' && (
            <Chip 
              label="COMPLETED" 
              size="small" 
              sx={{ 
                ml: 2, 
                bgcolor: 'transparent', 
                color: 'text.secondary',
                border: '1px solid #404040',
                fontSize: '0.7rem'
              }} 
            />
          )}
        </Box>

        {/* Mobile Portrait Scoreboard */}
        <Card elevation={0} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            
            <Stack spacing={4} alignItems="center">
              
              {/* Team 1 */}
              <Box textAlign="center" width="100%">
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 400,
                    color: currentSetWinner === 'team1' ? 'primary.main' : 'text.secondary',
                    mb: 2,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {match.team1Name}
                </Typography>
                
                <Typography 
                  variant="h1" 
                  component="div" 
                  sx={{ 
                    fontSize: '4rem',
                    fontWeight: 100,
                    lineHeight: 0.8,
                    mb: 1,
                    color: currentSetWinner === 'team1' ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {match.team1Score}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Sets: <Box component="span" sx={{ color: overallWinner === 'team1' ? 'primary.main' : 'inherit' }}>{match.team1Sets}</Box>
                </Typography>
              </Box>

              {/* Divider */}
              <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider' }} />

              {/* Team 2 */}
              <Box textAlign="center" width="100%">
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 400,
                    color: currentSetWinner === 'team2' ? 'secondary.main' : 'text.secondary',
                    mb: 2,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {match.team2Name}
                </Typography>
                
                <Typography 
                  variant="h1" 
                  component="div" 
                  sx={{ 
                    fontSize: '4rem',
                    fontWeight: 100,
                    lineHeight: 0.8,
                    mb: 1,
                    color: currentSetWinner === 'team2' ? 'secondary.main' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {match.team2Score}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Sets: <Box component="span" sx={{ color: overallWinner === 'team2' ? 'secondary.main' : 'inherit' }}>{match.team2Sets}</Box>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Set History */}
        {match.sets && match.sets.length > 0 && (
          <Box mb={3}>
            <Typography variant="caption" color="text.secondary" sx={{ 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              mb: 2, 
              display: 'block' 
            }}>
              Completed Sets
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              {match.sets.map((set) => (
                <Box key={set.id} sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      p: 2,
                      border: '1px solid #404040',
                      borderRadius: 1,
                      minWidth: 100,
                      bgcolor: 'transparent',
                      mb: 1
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Set {set.setNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: set.team1Points > set.team2Points ? 'primary.main' : 
                             set.team2Points > set.team1Points ? 'secondary.main' : 'text.primary',
                      fontWeight: 500 
                    }}>
                      {set.team1Points} - {set.team2Points}
                    </Typography>
                  </Box>
                  
                  {onMatchUpdate && (
                    <EditSet 
                      match={match} 
                      set={set} 
                      onSetUpdated={onMatchUpdate}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Match Completed */}
        {match.status === 'COMPLETED' && (
          <Box textAlign="center" py={3}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 300, mb: 1 }}>
              {match.team1Sets > match.team2Sets ? match.team1Name : match.team2Name} wins
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Final: {match.team1Sets} - {match.team2Sets}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Desktop layout - original design
  return (
    <Box maxWidth="1000px" mx="auto">
      
      {/* Minimal Status */}
      <Box textAlign="center" mb={4}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {getSetDescription(match.currentSet)}
        </Typography>
        {match.status === 'COMPLETED' && (
          <Chip 
            label="COMPLETED" 
            size="small" 
            sx={{ 
              ml: 2, 
              bgcolor: 'transparent', 
              color: 'text.secondary',
              border: '1px solid #404040',
              fontSize: '0.7rem'
            }} 
          />
        )}
      </Box>

      {/* Ultra-Clean Scoreboard */}
      <Card elevation={0} sx={{ mb: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 6 } }}>
          
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={{ xs: 6, md: 8 }}
            alignItems="center"
            justifyContent="center"
          >
            
            {/* Team 1 */}
            <Box textAlign="center" minWidth={{ md: 200 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 400,
                  color: currentSetWinner === 'team1' ? 'primary.main' : 'text.secondary',
                  mb: 3,
                  transition: 'color 0.3s ease'
                }}
              >
                {match.team1Name}
              </Typography>
              
              <Typography 
                variant="h1" 
                component="div" 
                sx={{ 
                  fontSize: { xs: '5rem', md: '8rem' },
                  fontWeight: 100,
                  lineHeight: 0.8,
                  mb: 2,
                  color: currentSetWinner === 'team1' ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.3s ease'
                }}
              >
                {match.team1Score}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sets: <Box component="span" sx={{ color: overallWinner === 'team1' ? 'primary.main' : 'inherit' }}>{match.team1Sets}</Box>
              </Typography>
            </Box>

            {/* Minimal Divider */}
            <Box 
              sx={{ 
                width: { xs: '100%', md: '1px' },
                height: { xs: '1px', md: '120px' },
                bgcolor: 'divider'
              }} 
            />

            {/* Team 2 */}
            <Box textAlign="center" minWidth={{ md: 200 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 400,
                  color: currentSetWinner === 'team2' ? 'secondary.main' : 'text.secondary',
                  mb: 3,
                  transition: 'color 0.3s ease'
                }}
              >
                {match.team2Name}
              </Typography>
              
              <Typography 
                variant="h1" 
                component="div" 
                sx={{ 
                  fontSize: { xs: '5rem', md: '8rem' },
                  fontWeight: 100,
                  lineHeight: 0.8,
                  mb: 2,
                  color: currentSetWinner === 'team2' ? 'secondary.main' : 'text.secondary',
                  transition: 'color 0.3s ease'
                }}
              >
                {match.team2Score}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sets: <Box component="span" sx={{ color: overallWinner === 'team2' ? 'secondary.main' : 'inherit' }}>{match.team2Sets}</Box>
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Minimal Set History */}
      {match.sets && match.sets.length > 0 && (
        <Box mb={4}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2, display: 'block' }}>
            Completed Sets
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            {match.sets.map((set) => (
              <Box key={set.id} sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    p: 2,
                    border: '1px solid #404040',
                    borderRadius: 1,
                    minWidth: 120,
                    bgcolor: 'transparent',
                    mb: 1
                  }}
                >
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    Set {set.setNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: set.team1Points > set.team2Points ? 'primary.main' : 
                           set.team2Points > set.team1Points ? 'secondary.main' : 'text.primary',
                    fontWeight: 500 
                  }}>
                    {set.team1Points} - {set.team2Points}
                  </Typography>
                </Box>
                
                {onMatchUpdate && (
                  <EditSet 
                    match={match} 
                    set={set} 
                    onSetUpdated={onMatchUpdate}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Match Completed - Minimal */}
      {match.status === 'COMPLETED' && (
        <Box textAlign="center" py={4}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 300, mb: 1 }}>
            {match.team1Sets > match.team2Sets ? match.team1Name : match.team2Name} wins
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Final: {match.team1Sets} - {match.team2Sets}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ScoreBoard;