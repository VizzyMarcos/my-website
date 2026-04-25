# MongoDB Setup for VicMart

## Option 1: Local MongoDB (Recommended for Development)

### Install MongoDB locally:
1. Download from https://www.mongodb.com/try/download/community
2. Install the Community Edition
3. Start MongoDB service:
   - Windows: `net start MongoDB`
   - Mac/Linux: `brew services start mongodb-community`

### Create `.env.local` file in project root:
```
MONGODB_URI=mongodb://localhost:27017/vicmart
```

### Test Connection:
Run MongoDB Compass or use `mongosh` to verify connection

---

## Option 2: Cloud MongoDB (MongoDB Atlas)

### Create Free Cluster:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Add to `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vicmart?retryWrites=true&w=majority
```

---

## Setup Instructions:

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env.local` file** (copy the connection string from above)

3. **Run the development server:**
```bash
npm run dev
```

4. **Access admin dashboard:**
   - Go to `http://localhost:3000/admin`
   - Add your first product!

5. **View products:**
   - Home page: `http://localhost:3000`
   - Products with search: `http://localhost:3000/products`

---

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (requires form data)
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

---

## Tips:

- Admin dashboard is at `/admin` - manage all products there
- Products are stored in MongoDB collection "products"
- Stock updates when you add/modify products
- All changes are real-time!
