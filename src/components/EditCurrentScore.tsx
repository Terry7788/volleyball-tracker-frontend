'use client';

import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Match } from '@/types/match';
import { matchService } from '@/services/matchService';

interface EditCurrentScoreProps {
  match: Match;
  onScoreUpdated: (match: Match) => void;
}

const EditCurrentScore: React.FC<EditCurrentScoreProps> = ({ match, onScoreUpdated }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [team1Score, setTeam1Score] = useState<string>(match.team1Score.toString());
  const [team2Score, setTeam2Score] = useState<string>(match.team2Score.toString());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await submitScore();
  };

  // Button click handler
  const handleButtonSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    await submitScore();
  };

  // Shared submission logic
  const submitScore = async (): Promise<void> => {
    const team1Points = parseInt(team1Score);
    const team2Points = parseInt(team2Score);
    
    if (isNaN(team1Points) || isNaN(team2Points) || team1Points < 0 || team2Points < 0) {
      setError('Please enter valid scores (0 or higher)');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const updatedMatch = await matchService.editCurrentSetScore(match.id, team1Points, team2Points);
      onScoreUpdated(updatedMatch);
      setOpen(false);
    } catch (error: unknown) {
      console.error('Error editing current score:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Failed to update score. Please try again.');
      } else {
        setError('Failed to update score. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
    setTeam1Score(match.team1Score.toString());
    setTeam2Score(match.team2Score.toString());
    setError(null);
  };

  const handleOpen = (): void => {
    setTeam1Score(match.team1Score.toString());
    setTeam2Score(match.team2Score.toString());
    setError(null);
    setOpen(true);
  };

  const isFormValid = (): boolean => {
    const team1Points = parseInt(team1Score);
    const team2Points = parseInt(team2Score);
    
    if (isNaN(team1Points) || isNaN(team2Points) || team1Points < 0 || team2Points < 0) {
      return false;
    }

    // Allow any valid scores - the backend will handle set completion if needed
    return true;
  };

  const getSetRequirement = (): string => {
    return match.currentSet === 5 ? 'Set 5: First to 15 (win by 2)' : `Set ${match.currentSet}: First to 25 (win by 2)`;
  };

  const hasScoreChanged = (): boolean => {
    const team1Points = parseInt(team1Score);
    const team2Points = parseInt(team2Score);
    return team1Points !== match.team1Score || team2Points !== match.team2Score;
  };

  const wouldCompleteSet = (): boolean => {
    const team1Points = parseInt(team1Score);
    const team2Points = parseInt(team2Score);
    
    if (isNaN(team1Points) || isNaN(team2Points)) return false;
    
    if (match.currentSet === 5) {
      // Set 5: first to 15, win by 2
      return (team1Points >= 15 && team1Points - team2Points >= 2) || 
             (team2Points >= 15 && team2Points - team1Points >= 2);
    } else {
      // Sets 1-4: first to 25, win by 2
      return (team1Points >= 25 && team1Points - team2Points >= 2) || 
             (team2Points >= 25 && team2Points - team1Points >= 2);
    }
  };

  // Only show for in-progress matches
  if (match.status !== 'IN_PROGRESS') {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        startIcon={<Edit sx={{ fontSize: 16 }} />}
        fullWidth
        sx={{
          fontSize: '0.75rem',
          py: 1.5,
          px: 1,
          textTransform: 'none',
          fontWeight: 400,
          borderColor: '#525252',
          color: 'text.secondary',
          '&:hover': {
            borderColor: '#71717a',
            backgroundColor: '#262626',
          }
        }}
      >
        Edit Score
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            border: '1px solid #404040',
            mx: { xs: 2, sm: 0 }
          }
        }}
      >
        <DialogContent sx={{ p: { xs: 4, sm: 6 } }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              fontWeight: 400, 
              mb: 1,
              textAlign: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Edit Current Score
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            display: 'block',
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '0.7rem', sm: '0.75rem' }
          }}>
            {getSetRequirement()}
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, fontSize: '0.875rem' }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 3, sm: 4 }} 
              alignItems={{ xs: 'center', sm: 'flex-end' }}
            >
              
              {/* Team 1 Score */}
              <Box 
                sx={{ 
                  flex: 1,
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '280px', sm: 'none' }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    mb: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {match.team1Name}
                </Typography>
                
                <TextField
                  label="Score"
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  inputProps={{ 
                    min: 0,
                    max: 999,
                    step: 1
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'center',
                      fontSize: { xs: '1.1rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>

              {/* VS Divider */}
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: { xs: '100%', sm: 60 },
                  minHeight: { xs: 40, sm: 56 },
                  pb: { xs: 0, sm: 3 }
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 100,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    textAlign: 'center'
                  }}
                >
                  -
                </Typography>
              </Box>

              {/* Team 2 Score */}
              <Box 
                sx={{ 
                  flex: 1,
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '280px', sm: 'none' }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    color: 'secondary.main',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    mb: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {match.team2Name}
                </Typography>
                
                <TextField
                  label="Score"
                  type="number"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  inputProps={{ 
                    min: 0,
                    max: 999,
                    step: 1
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      '&.Mui-focused fieldset': {
                        borderColor: 'secondary.main',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'secondary.main',
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'center',
                      fontSize: { xs: '1.1rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
            </Stack>

            {/* Validation Message */}
            {!isFormValid() && team1Score && team2Score && (
              <Typography variant="caption" color="error.main" sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 2,
                fontSize: '0.75rem'
              }}>
                Please enter valid scores (0 or higher)
              </Typography>
            )}

            {/* Info about score changes */}
            {isFormValid() && hasScoreChanged() && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="info.main" sx={{ 
                  fontSize: '0.7rem',
                  display: 'block'
                }}>
                  Score will be updated from {match.team1Score}-{match.team2Score} to {team1Score}-{team2Score}
                </Typography>
                
                {/* Check if the new scores would complete the set */}
                {wouldCompleteSet() && (
                  <Typography variant="caption" color="warning.main" sx={{ 
                    fontSize: '0.7rem',
                    display: 'block',
                    mt: 0.5
                  }}>
                    ⚠️ This score will complete the current set
                  </Typography>
                )}
              </Box>
            )}
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: { xs: 3, sm: 3 }, pt: 0 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            width="100%"
            alignItems="center"
          >
            <Button 
              onClick={handleClose}
              variant="outlined"
              fullWidth
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                fontWeight: 400,
                py: { xs: 1.5, sm: 1 }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleButtonSubmit}
              variant="contained"
              fullWidth
              disabled={loading || !isFormValid() || !hasScoreChanged()}
              sx={{ 
                textTransform: 'none',
                fontWeight: 400,
                py: { xs: 1.5, sm: 1 },
                bgcolor: (isFormValid() && hasScoreChanged()) ? '#ffffff' : '#404040',
                color: (isFormValid() && hasScoreChanged()) ? '#000000' : '#525252',
                '&:hover': {
                  bgcolor: (isFormValid() && hasScoreChanged()) ? '#e5e5e5' : '#404040',
                },
                '&:disabled': {
                  bgcolor: '#404040',
                  color: '#525252',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Update Score'
              )}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditCurrentScore;