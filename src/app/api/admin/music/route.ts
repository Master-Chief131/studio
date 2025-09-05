import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data');
const MUSIC_FILE = path.join(DATA_PATH, 'music.txt');

export async function GET() {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    const data = await fs.readFile(MUSIC_FILE, 'utf-8');
    return NextResponse.json({ music: data });
  } catch (err) {
    return NextResponse.json({ music: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    const { music } = await req.json();
    await fs.writeFile(MUSIC_FILE, music || '', 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.toString() });
  }
}
