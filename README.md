# E-Commerce Website

A modern, fully functional e-commerce website built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Features

✅ **Product Catalog** - Display 8 sample products with images and details  
✅ **Product Pages** - Individual product detail pages with full descriptions  
✅ **Shopping Cart** - Add/remove products, update quantities  
✅ **Checkout** - Simple checkout form with customer details  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **State Management** - Zustand for cart management  
✅ **Modern UI** - Tailwind CSS styling with smooth animations  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
my-ecommerce-project/
├── app/
│   ├── layout.tsx          # Root layout with navbar & footer
│   ├── page.tsx            # Home page with featured products
│   ├── globals.css         # Global styles
│   ├── products/[id]/      # Individual product detail pages
│   └── cart/               # Shopping cart page
├── components/
│   ├── Navbar.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   └── ProductCard.tsx     # Product card component
├── lib/
│   ├── products.ts         # Sample products data
│   └── store.ts            # Zustand cart store
├── styles/                 # Additional styles
├── public/                 # Static assets
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind configuration
└── next.config.js          # Next.js configuration
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Package Manager**: npm

## Available Pages

- **Home** `/` - Featured products listing
- **Product Detail** `/products/[id]` - Individual product page
- **Shopping Cart** `/cart` - View and manage cart items

## Features Included

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Cart counter in navbar
- Persistent cart state (uses Zustand)

### Product Page
- View product details
- See product images from Unsplash
- Check stock availability
- Add to cart with quantity selection

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly buttons and interface

## Customization

### Add More Products
Edit `lib/products.ts` and add new product objects to the array.

### Change Colors
Modify `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: '#3B82F6',      // Change this
  secondary: '#10B981',    // Change this
  danger: '#EF4444',       // Change this
}
```

### Add More Pages
Create new TypeScript files in the `app/` directory following Next.js conventions.

## Next Steps

1. Customize the product data
2. Add authentication (NextAuth.js)
3. Connect to a real database (MongoDB, PostgreSQL)
4. Implement payment processing (Stripe, PayPal)
5. Add admin dashboard
6. Deploy to Vercel or another hosting platform

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

Happy coding! 🚀
