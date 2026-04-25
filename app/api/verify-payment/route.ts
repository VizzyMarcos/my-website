import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(req: Request) {
  try {
    const { orderId, reference } = await req.json();

    if (!orderId || !reference) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or reference" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: "Missing PAYSTACK_SECRET_KEY in environment" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok || !data.status || data.data?.status !== "success") {
      await dbConnect();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
        gatewayReference: reference,
      });

      return NextResponse.json(
        {
          success: false,
          error: data.message || "Payment verification failed",
          paystackStatus: data.data?.status || null,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        gatewayReference: data.data.reference,
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    console.error("Paystack verification error:", error);
    const message =
      error instanceof Error ? error.message : "Payment verification failed";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
