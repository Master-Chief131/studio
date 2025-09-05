import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MUSIC_DIR = path.join(process.cwd(), 'public', 'music');

export async function GET() {
  try {
    await fs.mkdir(MUSIC_DIR, { recursive: true });
    const files = await fs.readdir(MUSIC_DIR);
    // Only return mp3 files
    const mp3Files = files.filter(f => f.endsWith('.mp3'));
    return NextResponse.json({ files: mp3Files });
  } catch (err) {
    return NextResponse.json({ files: [] });
  }
}

export async function POST(req: NextRequest) {
  // Not implemented: file upload should be handled via multipart/form-data
  return NextResponse.json({ ok: false, error: 'Use PUT for file upload.' });
}

export async function PUT(req: NextRequest) {
  // Handle file upload (multipart/form-data)
  const formData = await req.formData();
  const files = formData.getAll('files');
  await fs.mkdir(MUSIC_DIR, { recursive: true });
  const savedFiles = [];
  for (const file of files) {
    if (file && typeof file === 'object' && 'arrayBuffer' in file && file.name.endsWith('.mp3')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(MUSIC_DIR, file.name);
      await fs.writeFile(filePath, buffer);
      savedFiles.push(file.name);
    }
  }
  return NextResponse.json({ ok: true, files: savedFiles });
}

export async function DELETE(req: NextRequest) {
  // Delete a file by name
  const { filename } = await req.json();
  if (!filename || typeof filename !== 'string') {
    return NextResponse.json({ ok: false, error: 'Missing filename' });
  }
  const filePath = path.join(MUSIC_DIR, filename);
  try {
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.toString() });
  }
}
