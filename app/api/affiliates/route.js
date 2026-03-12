import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// API pública para listar produtos afiliados exibidos na página de cupons
export async function GET() {
  try {
    const products = await prisma.affiliateProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message, products: [] }, { status: 200 });
  }
}

