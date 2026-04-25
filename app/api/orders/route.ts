import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const email = request.nextUrl.searchParams.get('email');
    const query = email ? { customerEmail: email.toLowerCase().trim() } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { customerName, customerEmail, customerPhone, items, totalAmount, paymentMethod, userId } = body;

    if (!customerName || !customerEmail || !customerPhone || !items || !totalAmount) {
      return NextResponse.json({ success: false, error: 'Missing order details' }, { status: 400 });
    }

    const order = await Order.create({
      userId: userId || null,
      customerName,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'none',
      paymentStatus: paymentMethod === 'none' ? 'paid' : 'pending',
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
