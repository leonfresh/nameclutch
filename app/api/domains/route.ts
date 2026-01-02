import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

const PROJECT_ROOT = process.cwd()
const DEV_DATA_PATH = path.join(PROJECT_ROOT, 'data', 'domains.json')
const PUBLIC_FALLBACK_PATH = path.join(PROJECT_ROOT, 'public', 'domains.json')

async function readJsonFile(filePath: string) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw) as { domains: unknown[] }
}

export async function GET() {
  try {
    // Prefer editable dev file if it exists.
    const data = await readJsonFile(DEV_DATA_PATH).catch(async () => readJsonFile(PUBLIC_FALLBACK_PATH))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ domains: [] }, { status: 200 })
  }
}
