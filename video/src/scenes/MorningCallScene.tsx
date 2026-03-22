import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile} from 'remotion';
import {CallScreen} from '../components/CallScreen';
import {GlassCard} from '../components/GlassCard';
import {theme} from '../styles/theme';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 5.5-35s (29.5s = 885 frames)
// Audio cues (relative to scene start, i.e. subtract 5.5s):
//   0.0s  sophie-morning-1  (5.7s) → ends 5.7
//   5.9s  maggie-morning-1  (5.8s) → ends 11.7
//  11.9s  sophie-morning-2  (3.3s) → ends 15.2
//  15.4s  maggie-morning-2  (4.9s) → ends 20.3
//  20.5s  sophie-morning-3  (5.3s) → ends 25.8
//  26-29.5s: family notification

export const MorningCallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Call screen visible for first 26s
  const callOpacity = interpolate(frame, [25 * FPS, 26 * FPS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Family notification (26-29.5s)
  const notifIn = interpolate(frame, [25.5 * FPS, 26 * FPS], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const notifSlide = spring({
    frame: Math.max(0, frame - 26 * FPS),
    fps,
    config: {damping: 14, stiffness: 100},
  });

  return (
    <AbsoluteFill>
      {/* Call screen */}
      <div style={{position: 'absolute', inset: 0, opacity: callOpacity}}>
        <CallScreen
          timeLabel="Tuesday 9:15 AM"
          callNumber="#12"
          lines={[
            {speaker: 'sophie', text: "Good morning, Maggie! I've been thinking about you. Did Emma ever get the hang of that bicycle?", startFrame: 0, durationFrames: Math.round(5.7 * FPS)},
            {speaker: 'maggie', text: "She did! You should have seen her, Sophie. She rode all the way down the driveway, no training wheels!", startFrame: Math.round(5.9 * FPS), durationFrames: Math.round(5.8 * FPS)},
            {speaker: 'sophie', text: "Oh, that's wonderful! I bet grandma was cheering from the porch.", startFrame: Math.round(11.9 * FPS), durationFrames: Math.round(3.3 * FPS)},
            {speaker: 'maggie', text: "You bet I was! I made her my famous dumplings to celebrate. She ate four of them!", startFrame: Math.round(15.4 * FPS), durationFrames: Math.round(4.9 * FPS)},
            {speaker: 'sophie', text: "Four! That's a new record. Those dumplings really are legendary, Maggie.", startFrame: Math.round(20.5 * FPS), durationFrames: Math.round(5.3 * FPS)},
          ]}
        />
      </div>

      {/* Family notification */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: notifIn,
          background: `linear-gradient(135deg, ${theme.colors.bgWarm} 0%, #f3ebe0 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 13,
            color: theme.colors.text,
            opacity: 0.4,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Meanwhile, on Sarah's phone...
        </div>

        {/* Phone notification mockup */}
        <div
          style={{
            width: 420,
            background: 'white',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            transform: `translateY(${(1 - notifSlide) * 30}px)`,
            opacity: notifSlide,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
            <Img
              src={staticFile('logo.png')}
              style={{width: 32, height: 32, borderRadius: 8}}
            />
            <div>
              <div style={{
                fontFamily: theme.fonts.body, fontSize: 14,
                fontWeight: 600, color: theme.colors.primary,
              }}>
                Lonesome No More
              </div>
              <div style={{
                fontFamily: theme.fonts.body, fontSize: 12,
                color: theme.colors.text, opacity: 0.4,
              }}>
                Just now
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 16,
              color: theme.colors.text,
              lineHeight: 1.5,
            }}
          >
            Mom talked about Emma's bike ride today — she was beaming the whole call! 🚲 Also made dumplings to celebrate.
          </div>
        </div>

        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 15,
            color: theme.colors.text,
            opacity: 0.3,
            fontStyle: 'italic',
            marginTop: 8,
          }}
        >
          Sarah smiles. Mom sounds happy.
        </div>
      </div>
    </AbsoluteFill>
  );
};
