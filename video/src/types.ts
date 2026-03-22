export interface ScriptSegment {
  id: string;
  scene: string;
  voice: 'narrator' | 'sophie';
  text: string;
  start_seconds: number;
}

export interface Script {
  narrator_voice: string;
  sophie_voice: string;
  segments: ScriptSegment[];
}

export interface AudioManifestEntry {
  id: string;
  file: string;
  duration_seconds: number;
  start_seconds: number;
}

export interface AudioManifest {
  entries: AudioManifestEntry[];
}
