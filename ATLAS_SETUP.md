# MongoDB Atlas — Network Access Setup

The app is currently returning **500 Internal Server Error** on all API routes because
your current IP is not whitelisted in MongoDB Atlas. Follow the steps below to allow
access from anywhere (recommended for development).

---

## Your Current Public IP
```
157.49.59.16
```

---

## Steps to Allow Access From Anywhere

### 1. Log in to Atlas
Go to → **https://cloud.mongodb.com** and sign in.

---

### 2. Select your project
Click on the **Disconnect Agencies** project (or whichever project contains the
`disconnet` cluster).

---

### 3. Open Network Access
In the **left sidebar**, under **Security**, click **Network Access**.

![Network Access is under Security in the left sidebar]

---

### 4. Add IP Address
Click the **+ Add IP Address** button (top right of the table).

---

### 5. Allow access from anywhere
In the dialog that opens, click **"Allow Access From Anywhere"**.

This automatically fills in `0.0.0.0/0` which means any IP can connect.

> ⚠️ This is fine for development. Before going to production, restrict this
> to your server's static IP or use a VPC peering / private endpoint instead.

---

### 6. Confirm
Click the **Confirm** button.

---

### 7. Wait for propagation
Atlas takes about **20–30 seconds** to apply the change. You'll see the status
change from `Pending` → `Active` in the Network Access table.

---

## Verify the connection

Once the status is **Active**, run this in the project root to confirm:

```bash
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bhattaraipravin455_db_user:JLGwKtLrWe2lNYo9@disconnet.fvrd4zy.mongodb.net/disconnect_agencies', { serverSelectionTimeoutMS: 12000 })
  .then(() => { console.log('SUCCESS — MongoDB connected!'); process.exit(0); })
  .catch(e => { console.error('FAILED:', e.message); process.exit(1); });
"
```

Expected output:
```
SUCCESS — MongoDB connected!
```

---

## After connecting

Restart the dev server:

```bash
npm run dev
```

Then retry **POST** `http://localhost:3000/api/auth/signup/initiate` — it will return
`200 OK` with `{ "message": "OTP sent to your email. Please verify." }`.

---

## What was already fixed (no action needed)

| Fix | File | Status |
|-----|------|--------|
| MongoDB retry on connection failure | `src/lib/mongodb.ts` | ✅ Done |
| Surfaces real error message instead of generic 500 | All `src/app/api/auth/**/route.ts` | ✅ Done |
| `.env.local` cleaned of hidden characters | `.env.local` | ✅ Done |
