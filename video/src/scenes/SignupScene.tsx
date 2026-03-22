import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile} from 'remotion';
import {FloatingOrbs} from '../components/FloatingOrbs';
import {ParticleField} from '../components/ParticleField';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 5-12s (7s = 210 frames)
// No audio — visual only

const ORBS = [
  {x: 80, y: 30, size: 100, color: theme.colors.accent, opacity: 0.06, speed: 0.5},
  {x: 20, y: 70, size: 120, color: theme.colors.primary, opacity: 0.04, speed: 0.7},
];

// Form fields that "fill in" sequentially
const FIELDS = [
  {label: 'Loved One\'s Name', value: 'Maggie Henderson', delay: 0.5 * FPS},
  {label: 'Age', value: '82', delay: 1.2 * FPS},
  {label: 'Location', value: 'Buffalo, NY', delay: 1.8 * FPS},
  {label: 'Interests & Hobbies', value: 'Mystery novels, cooking, piano, gardening', delay: 2.4 * FPS},
  {label: 'Family Members', value: 'Emma (granddaughter), Sarah (daughter), Tom (son)', delay: 3.0 * FPS},
  {label: 'Communication Style', value: 'Warm and chatty, loves storytelling', delay: 3.6 * FPS},
];

export const SignupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const formScale = spring({frame, fps, config: {damping: 16, stiffness: 100}});

  // "Profile created" confirmation
  const submitFrame = 5.2 * FPS;
  const submitted = frame >= submitFrame;
  const confirmOpacity = submitted
    ? spring({frame: frame - submitFrame, fps, config: {damping: 14, stiffness: 120}})
    : 0;

  const formOpacity = interpolate(frame, [submitFrame, submitFrame + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const gradAngle = 140 + Math.sin(frame * 0.012) * 8;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradAngle}deg, ${theme.colors.bgWarm} 0%, #f3ebe0 40%, ${theme.colors.bgSoft} 100%)`,
      }}
    >
      <FloatingOrbs orbs={ORBS} />
      <ParticleField count={25} color={`${theme.colors.primary}18`} speed={0.4} />

      {/* Form card */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: formOpacity,
          transform: `scale(${0.95 + formScale * 0.05})`,
        }}
      >
        <div
          style={{
            width: 580,
            background: 'white',
            borderRadius: 20,
            padding: '32px 40px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24}}>
            <Img src={staticFile('logo.png')} style={{width: 28, height: 28}} />
            <span style={{
              fontFamily: theme.fonts.heading, fontSize: 20, color: theme.colors.primary,
            }}>
              Tell us about your loved one
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 4, backgroundColor: 'rgba(95,122,97,0.1)', borderRadius: 2, marginBottom: 24,
          }}>
            <div style={{
              height: '100%', borderRadius: 2,
              backgroundColor: theme.colors.primary,
              width: `${interpolate(frame, [0, 5 * FPS], [0, 100], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })}%`,
            }} />
          </div>

          {/* Fields */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {FIELDS.map((field, i) => {
              const fieldProgress = spring({
                frame: Math.max(0, frame - field.delay),
                fps,
                config: {damping: 18, stiffness: 150},
              });
              const show = frame >= field.delay;
              const typing = show && frame < field.delay + 20;

              // Typewriter for value
              const charCount = show
                ? Math.floor(interpolate(
                    frame - field.delay,
                    [0, field.value.length * 0.5],
                    [0, field.value.length],
                    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
                  ))
                : 0;

              return (
                <div
                  key={i}
                  style={{
                    opacity: show ? fieldProgress : 0,
                    transform: `translateY(${(1 - (show ? fieldProgress : 0)) * 8}px)`,
                  }}
                >
                  <div style={{
                    fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
                    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4, fontWeight: 600,
                  }}>
                    {field.label}
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#f8f6f3',
                    borderRadius: 8,
                    border: `1px solid ${typing ? theme.colors.primary : 'rgba(0,0,0,0.06)'}`,
                    fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.text,
                    minHeight: 20,
                  }}>
                    {field.value.slice(0, charCount)}
                    {typing && <span style={{opacity: 0.4}}>|</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit button */}
          <div style={{marginTop: 20}}>
            <div style={{
              padding: '10px 0',
              backgroundColor: frame >= 4.8 * FPS ? theme.colors.primary : 'rgba(95,122,97,0.3)',
              borderRadius: 10,
              textAlign: 'center',
              fontFamily: theme.fonts.body, fontSize: 15, color: 'white', fontWeight: 600,
            }}>
              Create Profile
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          opacity: confirmOpacity,
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          backgroundColor: '#059669', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div style={{
          fontFamily: theme.fonts.heading, fontSize: 28, color: theme.colors.primary,
        }}>
          Profile Created
        </div>
        <div style={{
          fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.text, opacity: 0.5,
        }}>
          Sophie will call Maggie tomorrow morning
        </div>
      </div>
    </AbsoluteFill>
  );
};
