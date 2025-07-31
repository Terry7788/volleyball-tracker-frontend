import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Button,
    Box,
    Typography,
    Stack,
    CircularProgress,
    Divider,
    Dialog,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import { Match, TeamType } from '@/types/match';
import { matchService } from '@/services/matchService';
import EditCurrentScore from './EditCurrentScore';

interface ScoreControlsProps {
    match: Match | null;
    onMatchUpdate: (match: Match) => void;
    isMobile?: boolean;
    isLandscape?: boolean;
}

const ScoreControls: React.FC<ScoreControlsProps> = ({
    match,
    onMatchUpdate,
    isMobile = false,
    isLandscape = false
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!match || match.status !== 'IN_PROGRESS') {
        return null;
    }

    const handleScoreUpdate = async (team: TeamType): Promise<void> => {
        setLoading(true);
        try {
            const updatedMatch = await matchService.updateScore(match.id, team);
            onMatchUpdate(updatedMatch);
        } catch (error) {
            console.error('Error updating score:', error);
        } finally {
            setLoading(false);
        }
    };

    // Updated handleUndo function with better error handling:
    const handleUndo = async (): Promise<void> => {
        setLoading(true);
        try {
            const updatedMatch = await matchService.undoLastPoint(match.id);
            onMatchUpdate(updatedMatch);
        } catch (error) {
            console.error('Error undoing point:', error);
            // Show user-friendly error message
            let errorMessage = 'Failed to undo point';
            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                errorMessage = err.response?.data?.message || 'Failed to undo point';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSet = async (): Promise<void> => {
        setLoading(true);
        try {
            const updatedMatch = await matchService.resetCurrentSet(match.id);
            onMatchUpdate(updatedMatch);
            setResetDialogOpen(false);
        } catch (error) {
            console.error('Error resetting set:', error);
        } finally {
            setLoading(false);
        }
    };

    const isUndoDisabled = (): boolean => {
        return loading ||
            (match.team1Score === 0 && match.team2Score === 0) || // No points to undo
            Boolean(match.undoUsed); // Undo was already used
    };

    const getUndoButtonText = (): string => {
        return 'Undo'; // Always show "Undo"
    };

    // Mobile landscape layout - fixed to bottom
    if (isMobile && isLandscape) {
        return (
            <>
                <Box sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'background.default',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                    zIndex: 1000
                }}>

                    {/* Compact landscape controls */}
                    <Stack direction="row" spacing={1} maxWidth="600px" mx="auto">
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => handleScoreUpdate('team1')}
                            disabled={loading}
                            color="primary"
                            sx={{
                                py: 2,
                                fontSize: '0.8rem',
                                fontWeight: 400,
                                borderRadius: 2,
                                textTransform: 'none',
                                minHeight: 48
                            }}
                        >
                            {loading ? <CircularProgress size={16} color="inherit" /> : `+1 ${match.team1Name}`}
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => handleScoreUpdate('team2')}
                            disabled={loading}
                            color="secondary"
                            sx={{
                                py: 2,
                                fontSize: '0.8rem',
                                fontWeight: 400,
                                borderRadius: 2,
                                textTransform: 'none',
                                minHeight: 48
                            }}
                        >
                            {loading ? <CircularProgress size={16} color="inherit" /> : `+1 ${match.team2Name}`}
                        </Button>

                        {/* Compact utility buttons */}
                        <Button
                            variant="outlined"
                            onClick={handleUndo}
                            disabled={isUndoDisabled()}
                            sx={{
                                py: 1.5,
                                fontSize: '0.7rem',
                                fontWeight: 400,
                                textTransform: 'none',
                                minWidth: 60,
                                px: 1,
                                borderColor: '#525252',
                                color: 'text.secondary',
                                '&:hover': {
                                    borderColor: '#71717a',
                                    backgroundColor: '#262626',
                                },
                                '&:disabled': {
                                    borderColor: '#404040',
                                    color: '#525252',
                                    opacity: 0.5,
                                }
                            }}
                        >
                            {getUndoButtonText()}
                        </Button>

                        <EditCurrentScore
                            match={match}
                            onScoreUpdated={onMatchUpdate}
                        />

                        <Button
                            variant="outlined"
                            onClick={() => setResetDialogOpen(true)}
                            disabled={match.team1Score === 0 && match.team2Score === 0}
                            sx={{
                                py: 2,
                                fontSize: '0.7rem',
                                fontWeight: 400,
                                textTransform: 'none',
                                minWidth: 50,
                                px: 1
                            }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Box>

                {/* Error Snackbar */}
                <Snackbar 
                    open={!!errorMessage} 
                    autoHideDuration={4000} 
                    onClose={() => setErrorMessage(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setErrorMessage(null)} 
                        severity="error" 
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>

                {/* Reset Confirmation Dialog */}
                <Dialog
                    open={resetDialogOpen}
                    onClose={() => setResetDialogOpen(false)}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            border: '1px solid #404040'
                        }
                    }}
                >
                    <DialogContent sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, mb: 2 }}>
                            Reset Set?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            This will reset the current set score to 0 - 0.
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <Box component="span" sx={{ color: 'primary.main' }}>{match.team1Name} {match.team1Score}</Box>
                            {' - '}
                            <Box component="span" sx={{ color: 'secondary.main' }}>{match.team2Score} {match.team2Name}</Box>
                        </Typography>
                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setResetDialogOpen(false)}
                            variant="outlined"
                            fullWidth
                            disabled={loading}
                            sx={{ textTransform: 'none', fontWeight: 400 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResetSet}
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 400,
                                bgcolor: '#ef4444',
                                color: '#ffffff',
                                '&:hover': { bgcolor: '#dc2626' }
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Reset'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    // Mobile portrait layout
    if (isMobile) {
        return (
            <Box maxWidth="600px" mx="auto" mt={4}>

                {/* Main Score Buttons */}
                <Card elevation={0}>
                    <CardContent sx={{ p: 3 }}>

                        <Stack spacing={3}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={() => handleScoreUpdate('team1')}
                                disabled={loading}
                                color="primary"
                                sx={{
                                    py: 3,
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    minHeight: 60
                                }}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : `+1 ${match.team1Name}`}
                            </Button>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={() => handleScoreUpdate('team2')}
                                disabled={loading}
                                color="secondary"
                                sx={{
                                    py: 3,
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    minHeight: 60
                                }}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : `+1 ${match.team2Name}`}
                            </Button>
                        </Stack>

                        {/* Divider */}
                        <Divider sx={{ my: 3 }} />

                        {/* Utility Controls */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleUndo}
                                disabled={isUndoDisabled()}
                                sx={{
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 400,
                                    textTransform: 'none',
                                    borderColor: '#525252',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        borderColor: '#71717a',
                                        backgroundColor: '#262626',
                                    },
                                    '&:disabled': {
                                        borderColor: '#404040',
                                        color: '#525252',
                                        opacity: 0.5,
                                    }
                                }}
                            >
                                {getUndoButtonText()}
                            </Button>

                            <EditCurrentScore
                                match={match}
                                onScoreUpdated={onMatchUpdate}
                            />

                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setResetDialogOpen(true)}
                                disabled={match.team1Score === 0 && match.team2Score === 0}
                                sx={{
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 400,
                                    textTransform: 'none'
                                }}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Score Info */}
                <Box textAlign="center" mt={3}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <Box component="span" sx={{ color: 'primary.main' }}>{match.team1Name} {match.team1Score}</Box> • <Box component="span" sx={{ color: 'secondary.main' }}>{match.team2Score} {match.team2Name}</Box>
                    </Typography>
                </Box>

                {/* Error Snackbar */}
                <Snackbar 
                    open={!!errorMessage} 
                    autoHideDuration={4000} 
                    onClose={() => setErrorMessage(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setErrorMessage(null)} 
                        severity="error" 
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>

                {/* Reset Confirmation Dialog */}
                <Dialog
                    open={resetDialogOpen}
                    onClose={() => setResetDialogOpen(false)}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            border: '1px solid #404040'
                        }
                    }}
                >
                    <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, mb: 2 }}>
                            Reset Set?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            This will reset the current set score to 0 - 0. This action cannot be undone.
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            display: 'block',
                            mb: 1
                        }}>
                            Current Score
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <Box component="span" sx={{ color: 'primary.main' }}>{match.team1Name} {match.team1Score}</Box>
                            {' - '}
                            <Box component="span" sx={{ color: 'secondary.main' }}>{match.team2Score} {match.team2Name}</Box>
                        </Typography>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button
                            onClick={() => setResetDialogOpen(false)}
                            variant="outlined"
                            fullWidth
                            disabled={loading}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 400
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResetSet}
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 400,
                                bgcolor: '#ef4444',
                                color: '#ffffff',
                                '&:hover': {
                                    bgcolor: '#dc2626'
                                },
                                '&:disabled': {
                                    bgcolor: '#404040',
                                    color: '#525252',
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Reset Set'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    // Desktop layout - original design
    return (
        <Box maxWidth="800px" mx="auto" mt={6}>

            {/* Main Score Buttons */}
            <Card elevation={0}>
                <CardContent sx={{ p: 4 }}>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => handleScoreUpdate('team1')}
                            disabled={loading}
                            color="primary"
                            sx={{
                                py: 3,
                                fontSize: '1rem',
                                fontWeight: 400,
                                borderRadius: 2,
                                textTransform: 'none',
                                minHeight: 56
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : `+1 ${match.team1Name}`}
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => handleScoreUpdate('team2')}
                            disabled={loading}
                            color="secondary"
                            sx={{
                                py: 3,
                                fontSize: '1rem',
                                fontWeight: 400,
                                borderRadius: 2,
                                textTransform: 'none',
                                minHeight: 56
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : `+1 ${match.team2Name}`}
                        </Button>
                    </Stack>

                    {/* Subtle Divider */}
                    <Divider sx={{ my: 4 }} />

                    {/* Utility Controls */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleUndo}
                            disabled={isUndoDisabled()}
                            sx={{
                                py: 1.5,
                                fontSize: '0.875rem',
                                fontWeight: 400,
                                textTransform: 'none',
                                borderColor: '#525252',
                                color: 'text.secondary',
                                '&:hover': {
                                    borderColor: '#71717a',
                                    backgroundColor: '#262626',
                                },
                                '&:disabled': {
                                    borderColor: '#404040',
                                    color: '#525252',
                                    opacity: 0.5,
                                }
                            }}
                        >
                            {getUndoButtonText()}
                        </Button>

                        <EditCurrentScore
                            match={match}
                            onScoreUpdated={onMatchUpdate}
                        />

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setResetDialogOpen(true)}
                            disabled={match.team1Score === 0 && match.team2Score === 0}
                            sx={{
                                py: 1.5,
                                fontSize: '0.875rem',
                                fontWeight: 400,
                                textTransform: 'none'
                            }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Minimal Score Info */}
            <Box textAlign="center" mt={3}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <Box component="span" sx={{ color: 'primary.main' }}>{match.team1Name} {match.team1Score}</Box> • <Box component="span" sx={{ color: 'secondary.main' }}>{match.team2Score} {match.team2Name}</Box>
                </Typography>
            </Box>

            {/* Error Snackbar */}
            <Snackbar 
                open={!!errorMessage} 
                autoHideDuration={4000} 
                onClose={() => setErrorMessage(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setErrorMessage(null)} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* Reset Confirmation Dialog */}
            <Dialog
                open={resetDialogOpen}
                onClose={() => setResetDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        border: '1px solid #404040'
                    }
                }}
            >
                <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, mb: 2 }}>
                        Reset Set?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        This will reset the current set score to 0 - 0. This action cannot be undone.
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        mb: 1
                    }}>
                        Current Score
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        <Box component="span" sx={{ color: 'primary.main' }}>{match.team1Name} {match.team1Score}</Box>
                        {' - '}
                        <Box component="span" sx={{ color: 'secondary.main' }}>{match.team2Score} {match.team2Name}</Box>
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setResetDialogOpen(false)}
                        variant="outlined"
                        fullWidth
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 400
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleResetSet}
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 400,
                            bgcolor: '#ef4444',
                            color: '#ffffff',
                            '&:hover': {
                                bgcolor: '#dc2626'
                            },
                            '&:disabled': {
                                bgcolor: '#404040',
                                color: '#525252',
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Reset Set'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ScoreControls;