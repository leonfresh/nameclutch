import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const PROJECT_ROOT = process.cwd();
const DEV_DATA_PATH = path.join(PROJECT_ROOT, "data", "domains.json");

type Domain = {
  id: number;
  name: string;
  price: string;
  tld: string;
  featured: boolean;
  category: string;
  gradient: string;
  logo?: string | null;
  pitch?: {
    headline: string;
    subhead: string;
    paragraph: string;
    bullets: string[];
    taglines: string[];
  } | null;
};

type Data = { domains: Domain[] };

async function readData(): Promise<Data> {
  const raw = await fs.readFile(DEV_DATA_PATH, "utf8");
  return JSON.parse(raw) as Data;
}

async function writeData(data: Data) {
  await fs.writeFile(
    DEV_DATA_PATH,
    JSON.stringify(data, null, 2) + "\n",
    "utf8"
  );
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Admin API disabled in production" },
      { status: 403 }
    );
  }

  const id = Number(ctx.params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const data = await readData();
  const before = data.domains.length;
  data.domains = data.domains.filter((d) => d.id !== id);

  if (data.domains.length === before) {
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 }
    );
  }

  await writeData(data);
  return NextResponse.json({ ok: true, domains: data.domains });
}
