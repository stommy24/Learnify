import React, { useEffect, useRef } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import confetti from 'canvas-confetti';
import { styled } from '@mui/material/styles';

interface AchievementUnlockAnimationProps {
  title: string;
  description: string;
  points: number;
  onComplete?: () => void;
}

const AnimationContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
  textAlign: 'center',
  minWidth: 300,
}));

const PointsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '2rem',
  marginTop: theme.spacing(2),
}));

export const AchievementUnlockAnimation: React.FC<AchievementUnlockAnimationProps> = ({
  title,
  description,
  points,
  onComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configure confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults: confetti.Options = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 999,
      shapes: ['square' as const, 'circle' as const],
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    };

    // Create confetti animation
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        onComplete?.();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <Fade in timeout={1000}>
      <AnimationContainer ref={containerRef}>
        <Typography variant="h4" gutterBottom>
          Achievement Unlocked!
        </Typography>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {description}
        </Typography>
        <PointsText>
          +{points} Points
        </PointsText>
      </AnimationContainer>
    </Fade>
  );
}; 
