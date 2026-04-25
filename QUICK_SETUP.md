# VicMart - MongoDB Setup Guide

## ⚠️ Current Error
```
Failed to load products
Error: connect ECONNREFUSED ::1:27017
```

**This means MongoDB is not running on your computer.**

---

## ✅ QUICK FIX (Choose ONE Option)

### Option A: Install MongoDB Locally (Recommended)

#### Step 1: Download MongoDB
- Visit: https://www.mongodb.com/try/download/community
- Select: **Windows** → Choose latest version
- Download the `.msi` installer

#### Step 2: Install
- Run the installer
- ✅ Check: "Install MongoDB as a Service"
- Keep default settings
- Click Install

#### Step 3: Start MongoDB
Open **PowerShell as Administrator** and run:
```powershell
net start MongoDB
```

Verify it's running:
```powershell
Get-Service MongoDB
```

Should show: `Status : Running`

#### Step 4: Create `.env.local`
In your project root folder, create a file named `.env.local` with:
```
MONGODB_URI=mongodb://localhost:27017/vicmart
```

#### Step 5: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Close and reopen terminal
npm run dev
```

#### Step 6: Test
- Visit: http://localhost:3000/test
- Click "Test API Connection"
- Should show ✓ SUCCESS!

---

### Option B: Use MongoDB Atlas (Cloud - No Installation)

#### Step 1: Create Account
- Go to: https://www.mongodb.com/cloud/atlas
- Create free account (takes 2 minutes)

#### Step 2: Create Free Cluster
- Click "Create Deployment"
- Choose "M0 Free Tier"
- Select region (any is fine)
- Click "Create"

#### Step 3: Get Connection String
- Wait for cluster to be created (5-10 min)
- Click "Connect"
- Choose "Drivers"
- Copy connection string that looks like:
```
mongodb+srv://username:password@cluster.mongodb.net/vicmart?retryWrites=true&w=majority
```

#### Step 4: Update `.env.local`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vicmart?retryWrites=true&w=majority
```

#### Step 5: Restart Dev Server
```bash
npm run dev
```

---

## 🔍 Troubleshooting

### "Service not found" error
- MongoDB not installed, go back to Option A Step 1-2

### "Connection refused" error persists
- Is PowerShell running as **Administrator**?
- Try: `Get-Service MongoDB` to check status
- Restart computer and try again

### Can't find `.env.local` file?
- Open your project in VS Code
- Right-click in file explorer on left
- Select "New File"
- Name it: `.env.local`
- Paste MONGODB_URI

### Still getting errors?
- Check browser console (Press F12)
- Check terminal output where `npm run dev` is running
- Look for error messages and share them

---

## ✨ Once Working

### Add First Product:
1. Go to: http://localhost:3000/admin
2. Click "+ Add New Product"
3. Fill in details:
   - Name: "My First Product"
   - Price: 99.99
   - Category: accessories
   - Stock: 10
   - Image: any image URL
4. Click "Add Product"
5. Visit homepage to see it!

---

## 📞 Need Help?

Share the exact error message from your terminal and I'll help you fix it!

Which option would you like to choose: **A (Local)** or **B (Cloud)**?
