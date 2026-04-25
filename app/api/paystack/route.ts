import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(request: NextRequest) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ success: false, error: 'Missing PAYSTACK_SECRET_KEY in environment' }, { status: 500 });
  }

  try {
    const { email, amount, callbackUrl, orderId } = await request.json();

    if (!email || !amount || !callbackUrl) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const body = {
      email,
      amount: Math.round(amount * 100),
      callback_url: callbackUrl,
      metadata: { orderId },
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ success: false, error: data.message || 'Paystack initialization failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data.data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Paystack request failed' }, { status: 500 });
  }
}
