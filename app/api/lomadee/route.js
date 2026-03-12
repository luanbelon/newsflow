import { NextResponse } from 'next/server';

// Base seguindo a documentação oficial:
// https://docs.lomadee.com.br/api-reference/affiliate/products/all
const LOMADEE_BASE = 'https://api-beta.lomadee.com.br';
const API_KEY = process.env.LOMADEE_API_KEY || '';

async function lomadee(path, params = {}) {
  const qs = new URLSearchParams({ page: 1, limit: 50, ...params }).toString();
  const res = await fetch(`${LOMADEE_BASE}${path}?${qs}`, {
    headers: { 'x-api-key': API_KEY },
    next: { revalidate: 3600 }, // cache 1 hora
  });

  if (!res.ok) {
    throw new Error(`Lomadee ${path}: ${res.status}`);
  }

  return res.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Mesmo que o front envie ?type=campaigns ou ?type=offers,
  // usamos o endpoint de produtos, que retorna { data, meta }.
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 20);
  const search = searchParams.get('q') || undefined;

  const params = { page, limit };
  if (search) params.search = search;

  try {
    const data = await lomadee('/affiliate/products', params);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Lomadee API error:', error.message);
    return NextResponse.json({ error: error.message, data: [], meta: {} }, { status: 200 });
  }
}
