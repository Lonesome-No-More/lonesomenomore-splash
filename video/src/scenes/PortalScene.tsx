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

// Scene: 30-45s (15s = 450 frames)
// No audio — visual only
//
// Phase 1 (0-8s): Conversation detail page
// Phase 2 (8-15s): Dashboard view

const ORBS = [
  {x: 85, y: 20, size: 80, color: theme.colors.accent, opacity: 0.04, speed: 0.5},
  {x: 10, y: 80, size: 100, color: theme.colors.primary, opacity: 0.03, speed: 0.4},
];

// Sidebar nav items
const NAV_ITEMS = [
  {icon: '📊', label: 'Dashboard', active: false},
  {icon: '👥', label: 'Loved Ones', active: false},
  {icon: '💬', label: 'Conversations', active: true},
  {icon: '👨‍👩‍👧', label: 'Caregivers', active: false},
  {icon: '📈', label: 'Analytics', active: false},
];

const NAV_ITEMS_DASH = [
  {icon: '📊', label: 'Dashboard', active: true},
  {icon: '👥', label: 'Loved Ones', active: false},
  {icon: '💬', label: 'Conversations', active: false},
  {icon: '👨‍👩‍👧', label: 'Caregivers', active: false},
  {icon: '📈', label: 'Analytics', active: false},
];

const TRANSCRIPT_LINES = [
  {speaker: 'Sophie', text: 'Good morning, Maggie! Did Emma ever get the hang of that bicycle?'},
  {speaker: 'Maggie', text: 'She did! Rode all the way down the driveway.'},
  {speaker: 'Sophie', text: 'Those dumplings really are legendary!'},
  {speaker: 'Maggie', text: "I've been a little tired this week, to be honest."},
];

// Dashboard call cards
const RECENT_CALLS = [
  {date: 'Today, 9:15 AM', mood: '😊', summary: 'Talked about Emma\'s bike ride and dumplings', duration: '8 min'},
  {date: 'Yesterday', mood: '😌', summary: 'Discussed mystery novel, shared gardening tips', duration: '12 min'},
  {date: 'Monday', mood: '😊', summary: 'Piano practice, called about the weather', duration: '6 min'},
  {date: 'Sunday', mood: '🥰', summary: 'Family visit recap, excited about Emma', duration: '15 min'},
];

export const PortalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase transitions
  const phase1Opacity = interpolate(frame, [7.5 * FPS, 8 * FPS], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const phase2Opacity = interpolate(frame, [7.5 * FPS, 8 * FPS], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const isPhase2 = frame >= 7.5 * FPS;
  const navItems = isPhase2 ? NAV_ITEMS_DASH : NAV_ITEMS;

  const gradAngle = 145 + Math.sin(frame * 0.008) * 5;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradAngle}deg, #f5f1ec 0%, ${theme.colors.bgWarm} 50%, #ede7df 100%)`,
      }}
    >
      <ParticleField count={15} color={`${theme.colors.primary}10`} speed={0.3} />

      {/* Portal layout */}
      <div style={{display: 'flex', width: '100%', height: '100%'}}>

        {/* Sidebar */}
        <div
          style={{
            width: 220,
            backgroundColor: 'white',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            padding: '24px 0',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 12px rgba(0,0,0,0.02)',
          }}
        >
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 20px', marginBottom: 28,
          }}>
            <Img src={staticFile('logo.png')} style={{width: 28, height: 28}} />
            <span style={{
              fontFamily: theme.fonts.heading, fontSize: 14, color: theme.colors.primary,
            }}>Lonesome No More</span>
          </div>

          {/* Nav */}
          {navItems.map((item, i) => {
            const navProgress = spring({
              frame: Math.max(0, frame - i * 4),
              fps, config: {damping: 18, stiffness: 140},
            });
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 20px',
                  backgroundColor: item.active ? 'rgba(95,122,97,0.06)' : 'transparent',
                  borderLeft: item.active ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
                  opacity: navProgress,
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  color: item.active ? theme.colors.primary : theme.colors.text,
                  fontWeight: item.active ? 600 : 400,
                }}
              >
                <span style={{fontSize: 16}}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{flex: 1, padding: '24px 32px', overflow: 'hidden', position: 'relative'}}>

          {/* Phase 1: Conversation Detail */}
          <div style={{position: 'absolute', inset: '24px 32px', opacity: phase1Opacity}}>
            {/* Page header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <div>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.text,
                  opacity: 0.4, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4,
                }}>Conversation Detail</div>
                <div style={{
                  fontFamily: theme.fonts.heading, fontSize: 22, color: theme.colors.text,
                }}>Maggie Henderson — Today, 9:15 AM</div>
              </div>
              <div style={{
                fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text, opacity: 0.4,
              }}>Duration: 8 min</div>
            </div>

            <div style={{display: 'flex', gap: 24}}>
              {/* Left column: sentiment + summary */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16}}>
                {/* Sentiment card */}
                <div style={{
                  background: 'white', borderRadius: 12, padding: 20,
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
                    textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 12,
                  }}>Mood & Sentiment</div>

                  <div style={{display: 'flex', gap: 20, marginBottom: 16}}>
                    {[
                      {label: 'Mood', value: '😊', sub: 'Happy'},
                      {label: 'Score', value: '8.2', sub: '/10'},
                      {label: 'Tone', value: 'Warm', sub: 'Engaged'},
                    ].map((item, i) => {
                      const sp = spring({frame: frame - (1 * FPS + i * 6), fps, config: {damping: 14, stiffness: 130}});
                      return (
                        <div key={i} style={{
                          flex: 1, textAlign: 'center',
                          padding: '10px 0',
                          backgroundColor: i === 0 ? 'rgba(5,150,105,0.05)' : 'rgba(95,122,97,0.03)',
                          borderRadius: 8,
                          opacity: frame >= 1 * FPS + i * 6 ? sp : 0,
                        }}>
                          <div style={{
                            fontFamily: theme.fonts.heading, fontSize: item.label === 'Mood' ? 28 : 22,
                            color: theme.colors.primary, fontWeight: 700,
                          }}>{item.value}</div>
                          <div style={{
                            fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text, opacity: 0.5,
                          }}>{item.sub}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Concern flag */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px',
                    backgroundColor: 'rgba(217,119,6,0.06)',
                    borderRadius: 8, borderLeft: '3px solid #D97706',
                    opacity: interpolate(frame, [3 * FPS, 3.5 * FPS], [0, 1], {
                      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                    }),
                  }}>
                    <span style={{fontSize: 14}}>⚠️</span>
                    <span style={{
                      fontFamily: theme.fonts.body, fontSize: 13, color: '#92400E',
                    }}>Mentioned feeling tired — caregiver notified</span>
                  </div>
                </div>

                {/* AI Summary */}
                <div style={{
                  background: 'white', borderRadius: 12, padding: 20,
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
                    textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 10,
                  }}>AI Summary</div>
                  <div style={{
                    fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.text,
                    lineHeight: 1.6, opacity: interpolate(frame, [2 * FPS, 3 * FPS], [0, 0.8], {
                      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                    }),
                  }}>
                    Maggie was in great spirits discussing Emma's milestone of riding a bicycle without training wheels. She celebrated by making her famous dumplings. Mentioned feeling a bit tired this week. Expressed interest in finding a new mystery novel.
                  </div>
                </div>
              </div>

              {/* Right column: transcript */}
              <div style={{width: 420}}>
                <div style={{
                  background: 'white', borderRadius: 12, padding: 20,
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
                    textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 12,
                  }}>Transcript</div>

                  <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                    {TRANSCRIPT_LINES.map((line, i) => {
                      const lineProgress = spring({
                        frame: Math.max(0, frame - (1.5 * FPS + i * 15)),
                        fps, config: {damping: 16, stiffness: 140},
                      });
                      const show = frame >= 1.5 * FPS + i * 15;
                      const isSophie = line.speaker === 'Sophie';
                      return (
                        <div key={i} style={{
                          opacity: show ? lineProgress : 0,
                          transform: `translateY(${(1 - (show ? lineProgress : 0)) * 8}px)`,
                        }}>
                          <div style={{
                            fontFamily: theme.fonts.body, fontSize: 11,
                            color: isSophie ? theme.colors.primary : theme.colors.secondary,
                            fontWeight: 600, marginBottom: 2,
                          }}>{line.speaker}</div>
                          <div style={{
                            fontFamily: theme.fonts.body, fontSize: 13,
                            color: theme.colors.text, lineHeight: 1.5, opacity: 0.8,
                            paddingLeft: 8,
                            borderLeft: `2px solid ${isSophie ? theme.colors.primary : theme.colors.secondary}20`,
                          }}>{line.text}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Dashboard */}
          <div style={{position: 'absolute', inset: '24px 32px', opacity: phase2Opacity}}>
            {/* Header */}
            <div style={{marginBottom: 20}}>
              <div style={{
                fontFamily: theme.fonts.heading, fontSize: 22, color: theme.colors.text,
              }}>Dashboard</div>
            </div>

            {/* Stats row */}
            <div style={{display: 'flex', gap: 16, marginBottom: 20}}>
              {[
                {icon: '👥', label: 'Active Companions', value: '3', color: theme.colors.primary},
                {icon: '📞', label: 'Calls This Week', value: '12', color: theme.colors.secondary},
                {icon: '⏱️', label: 'Avg Duration', value: '9 min', color: theme.colors.accent},
                {icon: '💚', label: 'System Health', value: 'All Good', color: '#059669'},
              ].map((stat, i) => {
                const sp = spring({
                  frame: Math.max(0, frame - (8 * FPS + i * 4)),
                  fps, config: {damping: 14, stiffness: 130},
                });
                const show = frame >= 8 * FPS + i * 4;
                return (
                  <div key={i} style={{
                    flex: 1, background: 'white', borderRadius: 12, padding: '14px 16px',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                    opacity: show ? sp : 0,
                    transform: `translateY(${(1 - (show ? sp : 0)) * 10}px)`,
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6}}>
                      <span style={{fontSize: 16}}>{stat.icon}</span>
                      <span style={{
                        fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text,
                        opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1,
                      }}>{stat.label}</span>
                    </div>
                    <div style={{
                      fontFamily: theme.fonts.heading, fontSize: 22, color: stat.color, fontWeight: 700,
                    }}>{stat.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent calls + mood chart */}
            <div style={{display: 'flex', gap: 20}}>
              {/* Recent calls */}
              <div style={{
                flex: 1, background: 'white', borderRadius: 12, padding: 20,
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
                  textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 14,
                }}>Recent Calls</div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {RECENT_CALLS.map((call, i) => {
                    const sp = spring({
                      frame: Math.max(0, frame - (9 * FPS + i * 6)),
                      fps, config: {damping: 16, stiffness: 130},
                    });
                    const show = frame >= 9 * FPS + i * 6;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '8px 10px', borderRadius: 8,
                        backgroundColor: i === 0 ? 'rgba(95,122,97,0.04)' : 'transparent',
                        opacity: show ? sp : 0,
                      }}>
                        <span style={{fontSize: 20}}>{call.mood}</span>
                        <div style={{flex: 1}}>
                          <div style={{
                            fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.text,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            maxWidth: 400,
                          }}>{call.summary}</div>
                          <div style={{
                            fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.text, opacity: 0.4,
                          }}>{call.date}</div>
                        </div>
                        <div style={{
                          fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.text, opacity: 0.3,
                        }}>{call.duration}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mood trend */}
              <div style={{
                width: 340, background: 'white', borderRadius: 12, padding: 20,
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.primary,
                  textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 14,
                }}>Mood Trend</div>

                {/* SVG chart */}
                <svg width="300" height="120" viewBox="0 0 300 120">
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M 0,80 30,60 60,50 90,65 120,40 150,35 180,30 210,45 240,25 270,30 300,20 300,120 0,120 Z"
                    fill="url(#moodGrad)"
                    style={{
                      opacity: interpolate(frame, [10 * FPS, 11 * FPS], [0, 1], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                      }),
                    }}
                  />
                  {/* Line */}
                  <path
                    d="M 0,80 30,60 60,50 90,65 120,40 150,35 180,30 210,45 240,25 270,30 300,20"
                    fill="none"
                    stroke={theme.colors.primary}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 500,
                      strokeDashoffset: interpolate(frame, [9.5 * FPS, 12 * FPS], [500, 0], {
                        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                      }),
                    }}
                  />
                  {/* Data points */}
                  {[[270, 30], [240, 25], [210, 45], [180, 30]].map(([cx, cy], i) => {
                    const dotShow = frame >= 11 * FPS + i * 4;
                    const dotScale = dotShow
                      ? spring({frame: frame - (11 * FPS + i * 4), fps, config: {damping: 14, stiffness: 120}})
                      : 0;
                    return (
                      <circle key={i} cx={cx} cy={cy} r={4 * dotScale}
                        fill="white" stroke={theme.colors.primary} strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginTop: 8,
                  fontFamily: theme.fonts.body, fontSize: 10, color: theme.colors.text, opacity: 0.3,
                }}>
                  <span>2 weeks ago</span>
                  <span>Last week</span>
                  <span>This week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
