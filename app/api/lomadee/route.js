import { NextResponse } from 'next/server';

const LOMADEE_BASE = 'https://api.lomadee.com/v3';
const API_KEY = process.env.LOMADEE_API_KEY || '';

async function lomadee(path, params = {}) {
  const qs = new URLSearchParams({ page: 1, limit: 50, ...params }).toString();
  const res = await fetch(`${LOMADEE_BASE}${path}?${qs}`, {
    headers: { 'x-api-key': API_KEY },
    next: { revalidate: 3600 }, // cache 1 hora
  });
  if (!res.ok) throw new Error(`Lomadee ${path}: ${res.status}`);
  return res.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'campaigns';

  try {
    let data;

    if (type === 'campaigns') {
      data = await lomadee('/campaigns', { limit: 60 });
    } else if (type === 'offers') {
      data = await lomadee('/offer', { limit: 60 });
    } else if (type === 'products') {
      const keyword = searchParams.get('q') || 'promoção';
      data = await lomadee('/product/search', { keyword, limit: 40 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Lomadee API error:', error.message);
    return NextResponse.json({ error: error.message, data: [], meta: {} }, { status: 200 });
  }
}
