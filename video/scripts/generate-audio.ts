import {ElevenLabsClient} from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ScriptSegment {
  id: string;
  scene: string;
  voice: 'narrator' | 'sophie';
  text: string;
  start_seconds: number;
}

interface Script {
  narrator_voice: string;
  sophie_voice: string;
  segments: ScriptSegment[];
}

interface ManifestEntry {
  id: string;
  file: string;
  duration_seconds: number;
  start_seconds: number;
}

const AUDIO_DIR = path.join(__dirname, '..', 'src', 'assets', 'audio');
const SCRIPT_PATH = path.join(__dirname, '..', 'src', 'assets', 'script.json');

async function getVoiceId(client: ElevenLabsClient, voiceName: string): Promise<string> {
  const voices = await client.voices.getAll();
  const match = voices.voices.find(
    (v) =>
      v.name?.toLowerCase() === voiceName.toLowerCase() ||
      v.name?.toLowerCase().startsWith(voiceName.toLowerCase() + ' -') ||
      v.name?.toLowerCase().startsWith(voiceName.toLowerCase() + '-')
  );
  if (match) return match.voice_id;

  console.log(`\nVoice "${voiceName}" not found. Available voices:`);
  for (const v of voices.voices.slice(0, 20)) {
    console.log(`  - ${v.name} (${v.voice_id})`);
  }
  throw new Error(`Voice "${voiceName}" not found. Update script.json with an available voice name.`);
}

async function generateSegment(
  client: ElevenLabsClient,
  voiceId: string,
  segment: ScriptSegment
): Promise<ManifestEntry> {
  const outputPath = path.join(AUDIO_DIR, `${segment.id}.mp3`);

  if (fs.existsSync(outputPath)) {
    console.log(`  Skipping ${segment.id} (already exists)`);
    const stats = fs.statSync(outputPath);
    const estimatedDuration = stats.size / 16000;
    return {
      id: segment.id,
      file: `${segment.id}.mp3`,
      duration_seconds: Math.round(estimatedDuration * 10) / 10,
      start_seconds: segment.start_seconds,
    };
  }

  console.log(`  Generating ${segment.id}: "${segment.text.slice(0, 50)}..."`);

  const audio = await client.textToSpeech.convert(voiceId, {
    text: segment.text,
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_128',
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audio) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);

  fs.writeFileSync(outputPath, buffer);

  const estimatedDuration = buffer.length / 16000;

  console.log(`  Saved ${segment.id}.mp3 (~${estimatedDuration.toFixed(1)}s)`);

  return {
    id: segment.id,
    file: `${segment.id}.mp3`,
    duration_seconds: Math.round(estimatedDuration * 10) / 10,
    start_seconds: segment.start_seconds,
  };
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('Error: ELEVENLABS_API_KEY not set in .env');
    process.exit(1);
  }

  const client = new ElevenLabsClient({apiKey});

  const script: Script = JSON.parse(fs.readFileSync(SCRIPT_PATH, 'utf-8'));
  console.log(`Loaded script with ${script.segments.length} segments`);

  fs.mkdirSync(AUDIO_DIR, {recursive: true});

  console.log(`\nResolving voice: ${script.narrator_voice}`);
  const narratorVoiceId = await getVoiceId(client, script.narrator_voice);
  console.log(`  Found: ${narratorVoiceId}`);

  console.log(`Resolving voice: ${script.sophie_voice}`);
  const sophieVoiceId = await getVoiceId(client, script.sophie_voice);
  console.log(`  Found: ${sophieVoiceId}`);

  console.log('\nGenerating audio segments...');
  const manifest: ManifestEntry[] = [];

  for (const segment of script.segments) {
    const voiceId = segment.voice === 'narrator' ? narratorVoiceId : sophieVoiceId;
    const entry = await generateSegment(client, voiceId, segment);
    manifest.push(entry);
  }

  const manifestPath = path.join(AUDIO_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({entries: manifest}, null, 2));
  console.log(`\nManifest written to ${manifestPath}`);
  console.log('Done! Audio files are in src/assets/audio/');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
