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
  CircularProgress
} from '@mui/material';
import { Match } from '@/types/match';
import { matchService } from '@/services/matchService';

interface CreateMatchProps {
  onMatchCreated: (match: Match) => void;
}

const CreateMatch: React.FC<CreateMatchProps> = ({ onMatchCreated }) => {
  const [team1Name, setTeam1Name] = useState<string>('');
  const [team2Name, setTeam2Name] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!team1Name.trim() || !team2Name.trim()) {
      return;
    }

    setLoading(true);
    try {
      const newMatch = await matchService.createMatch(team1Name.trim(), team2Name.trim());
      onMatchCreated(newMatch);
      setTeam1Name('');
      setTeam2Name('');
      setOpen(false);
    } catch (error) {
      console.error('Error creating match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
    setTeam1Name('');
    setTeam2Name('');
  };

  const isFormValid = (): boolean => {
    return team1Name.trim().length > 0 && team2Name.trim().length > 0;
  };

  return (
    <>
      {/* Minimal Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ 
            py: 2,
            px: 4,
            fontSize: '0.875rem',
            fontWeight: 400,
            textTransform: 'none',
            bgcolor: '#ffffff',
            color: '#000000',
            '&:hover': {
              bgcolor: '#e5e5e5'
            }
          }}
        >
          New Match
        </Button>
      </Box>

      {/* Team-Oriented Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            border: '1px solid #404040',
            mx: { xs: 2, sm: 0 } // Add margin on mobile for better spacing
          }
        }}
      >
        <DialogContent sx={{ p: { xs: 3, sm: 6 } }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              fontWeight: 400, 
              mb: 4, 
              textAlign: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Create New Match
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 3, sm: 4 }} 
              alignItems={{ xs: 'center', sm: 'flex-end' }}
              sx={{ width: '100%' }}
            >
              
              {/* Team 1 */}
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
                  Team 1
                </Typography>
                
                <TextField
                  label="Team Name"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  placeholder="Enter team 1 name"
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
                      textAlign: 'center', // Center the input text
                    }
                  }}
                />
                
                <Box 
                  sx={{ 
                    height: 4,
                    bgcolor: team1Name.trim() ? 'primary.main' : 'transparent',
                    borderRadius: 1,
                    mt: 1,
                    transition: 'background-color 0.3s ease'
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
                  minHeight: { xs: 40, sm: 56 }, // Match input field height on mobile
                  pb: { xs: 0, sm: 3 }, // Remove bottom padding on mobile
                  order: { xs: 0, sm: 0 } // Keep natural order
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
                  VS
                </Typography>
              </Box>

              {/* Team 2 */}
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
                  Team 2
                </Typography>
                
                <TextField
                  label="Team Name"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  placeholder="Enter team 2 name"
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
                      textAlign: 'center', // Center the input text
                    }
                  }}
                />
                
                <Box 
                  sx={{ 
                    height: 4,
                    bgcolor: team2Name.trim() ? 'secondary.main' : 'transparent',
                    borderRadius: 1,
                    mt: 1,
                    transition: 'background-color 0.3s ease'
                  }} 
                />
              </Box>
            </Stack>

            {/* Match Info */}
            <Box textAlign="center" mt={{ xs: 3, sm: 4 }} mb={{ xs: 3, sm: 4 }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  lineHeight: 1.4,
                  display: 'block'
                }}
              >
                Best of 5 Sets • Sets 1-4: First to 25 • Set 5: First to 15
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 3 }} 
              justifyContent="center"
              alignItems="center"
            >
              <Button 
                onClick={handleClose}
                disabled={loading}
                variant="outlined"
                fullWidth={true} // Full width on mobile
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 400,
                  minWidth: { xs: '100%', sm: 100 },
                  maxWidth: { xs: '280px', sm: 'none' },
                  py: { xs: 1.5, sm: 1 }
                }}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                variant="contained"
                disabled={loading || !isFormValid()}
                fullWidth={true} // Full width on mobile
                sx={{ 
                  minWidth: { xs: '100%', sm: 120 },
                  maxWidth: { xs: '280px', sm: 'none' },
                  textTransform: 'none',
                  fontWeight: 400,
                  py: { xs: 1.5, sm: 1 },
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
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Start Match'}
              </Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateMatch;