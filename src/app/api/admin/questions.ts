import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data');
const QUESTIONS_FILE = path.join(DATA_PATH, 'questions.json');

export async function GET() {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    const data = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    const body = await req.json();
    await fs.writeFile(QUESTIONS_FILE, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.toString() });
  }
}
