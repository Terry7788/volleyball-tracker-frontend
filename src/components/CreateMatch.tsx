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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            border: '1px solid #404040'
          }
        }}
      >
        <DialogContent sx={{ p: 6 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, mb: 4, textAlign: 'center' }}>
            Create New Match
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="flex-end">
              
              {/* Team 1 - Left Side */}
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

              {/* VS Divider - Aligned with inputs */}
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
                  VS
                </Typography>
              </Box>

              {/* Team 2 - Right Side */}
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
            <Box textAlign="center" mt={4} mb={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Best of 5 Sets • Sets 1-4: First to 25 • Set 5: First to 15
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={3} justifyContent="center">
              <Button 
                onClick={handleClose}
                disabled={loading}
                variant="outlined"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 400,
                  minWidth: 100
                }}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                variant="contained"
                disabled={loading || !isFormValid()}
                sx={{ 
                  minWidth: 120,
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