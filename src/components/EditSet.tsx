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
  CircularProgress
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Match, SetScore } from '@/types/match';
import { matchService } from '@/services/matchService';

interface EditSetProps {
  match: Match;
  set: SetScore;
  onSetUpdated: (match: Match) => void;
}

const EditSet: React.FC<EditSetProps> = ({ match, set, onSetUpdated }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [team1Points, setTeam1Points] = useState<string>(set.team1Points.toString());
  const [team2Points, setTeam2Points] = useState<string>(set.team2Points.toString());
  const [loading, setLoading] = useState<boolean>(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await submitSet();
  };

  // Button click handler
  const handleButtonSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    await submitSet();
  };

  // Shared submission logic
  const submitSet = async (): Promise<void> => {
    const team1Score = parseInt(team1Points);
    const team2Score = parseInt(team2Points);
    
    if (isNaN(team1Score) || isNaN(team2Score) || team1Score < 0 || team2Score < 0) {
      return;
    }

    setLoading(true);
    try {
      const updatedMatch = await matchService.editCompletedSet(match.id, set.setNumber, team1Score, team2Score);
      onSetUpdated(updatedMatch);
      setOpen(false);
    } catch (error) {
      console.error('Error editing set:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
    setTeam1Points(set.team1Points.toString());
    setTeam2Points(set.team2Points.toString());
  };

  const isFormValid = (): boolean => {
    const team1Score = parseInt(team1Points);
    const team2Score = parseInt(team2Points);
    
    if (isNaN(team1Score) || isNaN(team2Score) || team1Score < 0 || team2Score < 0) {
      return false;
    }

    // Check if it's a valid volleyball score
    if (set.setNumber === 5) {
      // Set 5: first to 15, win by 2
      return (team1Score >= 15 && team1Score - team2Score >= 2) || 
             (team2Score >= 15 && team2Score - team1Score >= 2);
    } else {
      // Sets 1-4: first to 25, win by 2
      return (team1Score >= 25 && team1Score - team2Score >= 2) || 
             (team2Score >= 25 && team2Score - team1Score >= 2);
    }
  };

  const getSetRequirement = (): string => {
    return set.setNumber === 5 ? 'First to 15 (win by 2)' : 'First to 25 (win by 2)';
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(true)}
        startIcon={<Edit sx={{ fontSize: 16 }} />}
        sx={{
          fontSize: '0.75rem',
          py: 0.5,
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
        Edit
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            border: '1px solid #404040'
          }
        }}
      >
        <DialogContent sx={{ p: 6 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, mb: 1 }}>
            Edit Set {set.setNumber}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            display: 'block',
            mb: 4
          }}>
            {getSetRequirement()}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={4} alignItems="flex-end">
              
              {/* Team 1 Score */}
              <Box flex={1}>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  {match.team1Name}
                </Typography>
                
                <TextField
                  label="Points"
                  type="number"
                  value={team1Points}
                  onChange={(e) => setTeam1Points(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  inputProps={{ min: 0 }}
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
                  }}
                />
              </Box>

              {/* VS */}
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 60,
                  pb: 3
                }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 100,
                    fontSize: '1.5rem'
                  }}
                >
                  -
                </Typography>
              </Box>

              {/* Team 2 Score */}
              <Box flex={1}>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom 
                  sx={{ 
                    color: 'secondary.main',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  {match.team2Name}
                </Typography>
                
                <TextField
                  label="Points"
                  type="number"
                  value={team2Points}
                  onChange={(e) => setTeam2Points(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  inputProps={{ min: 0 }}
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
                  }}
                />
              </Box>
            </Stack>

            {!isFormValid() && team1Points && team2Points && (
              <Typography variant="caption" color="error.main" sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 2
              }}>
                Invalid score. {getSetRequirement()}
              </Typography>
            )}
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              fontWeight: 400
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleButtonSubmit}
            variant="contained"
            disabled={loading || !isFormValid()}
            sx={{ 
              textTransform: 'none',
              fontWeight: 400,
              bgcolor: isFormValid() ? '#ffffff' : '#404040',
              color: isFormValid() ? '#000000' : '#525252',
              '&:hover': {
                bgcolor: isFormValid() ? '#e5e5e5' : '#404040',
              },
              '&:disabled': {
                bgcolor: '#404040',
                color: '#525252',
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Set'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditSet;