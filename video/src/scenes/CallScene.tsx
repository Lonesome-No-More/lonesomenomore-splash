import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CallScreen} from '../components/CallScreen';
import {ParticleField} from '../components/ParticleField';
import {loadFont} from '@remotion/google-fonts/Merriweather';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

loadFont();
loadInter();

const FPS = 30;

// Scene: 12-31s (19s = 570 frames)
// Audio (relative to scene start, subtract 12s):
//   0.0s  sophie-call-1  (3.5s) → ends 3.5
//   3.8s  maggie-call-1  (5.7s) → ends 9.5
//  10.0s  sophie-call-2  (4.7s) → ends 14.7
//  15.0s  maggie-call-2  (3.3s) → ends 18.3

export const CallScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <CallScreen
        timeLabel="Tuesday 9:15 AM"
        callNumber="#12"
        lines={[
          {
            speaker: 'sophie',
            text: 'Good morning, Maggie! Did Emma ever get the hang of that bicycle?',
            startFrame: 0,
            durationFrames: Math.round(3.5 * FPS),
          },
          {
            speaker: 'maggie',
            text: 'She did! Rode all the way down the driveway. I made her my famous dumplings to celebrate.',
            startFrame: Math.round(3.8 * FPS),
            durationFrames: Math.round(5.7 * FPS),
          },
          {
            speaker: 'sophie',
            text: 'Those dumplings really are legendary! Have you picked up a new mystery novel yet?',
            startFrame: Math.round(10.0 * FPS),
            durationFrames: Math.round(4.7 * FPS),
          },
          {
            speaker: 'maggie',
            text: "Not yet. I've been a little tired this week, to be honest.",
            startFrame: Math.round(15.0 * FPS),
            durationFrames: Math.round(3.3 * FPS),
          },
        ]}
      />
      <ParticleField count={20} color="rgba(232,170,107,0.06)" speed={0.3} />
    </AbsoluteFill>
  );
};
