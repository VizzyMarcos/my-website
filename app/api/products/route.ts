import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const contentType = request.headers.get('content-type') || '';
    let productData: any;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const name = String(formData.get('name') || '');
      const price = parseFloat(String(formData.get('price') || '0'));
      const description = String(formData.get('description') || '');
      const stock = parseInt(String(formData.get('stock') || '0'), 10);
      let image = '';

      const imageFile = formData.get('imageFile') as File | null;
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'vicmart-products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        image = uploadResult.secure_url;
      }

      productData = { name, price, description, stock, image };
    } else {
      productData = await request.json();
    }

    if (!productData.name || !productData.description || !productData.image) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and image are required' },
        { status: 400 }
      );
    }

    const product = await Product.create(productData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 400 }
    );
  }
}