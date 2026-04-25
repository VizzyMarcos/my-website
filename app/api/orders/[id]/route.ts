import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();

    const allowed = ['paymentStatus', 'gatewayReference'];
    const patch: any = {};
    allowed.forEach((key) => {
      if (key in body) patch[key] = body[key];
    });

    const order = await Order.findByIdAndUpdate(params.id, patch, { new: true, runValidators: true });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
