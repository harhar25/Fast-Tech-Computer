# Firebase Realtime Database Rules - Permission Denied Fix

## Problem
You're seeing this error:
```
❌ Error: Permission denied
at Reference_impl.ts:824:16
```

This means your Firebase Database security rules are blocking all access.

---

## Solution: Update Firebase Rules

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project: **fast-tech-computer**
3. Go to **Realtime Database** (in left sidebar)
4. Click the **Rules** tab at the top

### Step 2: Copy & Paste These Rules

**For Public Shop (Anyone can view, admins can edit):**
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "admins": {
      ".read": false,
      ".write": false
    },
    "subscribers": {
      ".read": false,
      ".write": true
    },
    "reviews": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**OR For Simple Testing (Allow all read/write):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Step 3: Publish Rules
1. Click **Publish** button
2. Confirm the popup
3. Wait for "Rules published" message

### Step 4: Test
1. Reload your website (Ctrl+F5)
2. Check browser console for success logs
3. Products should now load

---

## Rule Explanations

| Rule | Meaning |
|------|---------|
| `".read": true` | Anyone can read (no login required) |
| `".write": "auth != null"` | Only logged-in users can write |
| `"auth.uid"` | Current user's Firebase ID |
| `root.child('admins')` | Check if user exists in admins list |

---

## Recommended Production Rules

For your e-commerce site, use these secure rules:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()",
      ".validate": "newData.hasChildren(['name', 'price', 'category'])"
    },
    "admins": {
      ".read": false,
      ".write": false
    },
    "subscribers": {
      ".read": false,
      ".write": true
    },
    "reviews": {
      ".read": true,
      ".write": "auth != null",
      ".validate": "newData.hasChildren(['rating', 'comment'])"
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

---

## Create Admin User in Database

To use the secure rules above, you need to mark your admin user:

1. Go to **Realtime Database**
2. Click **+ Create new** (if no data) or expand the tree
3. Create path: `admins`
4. Inside `admins`, add your Firebase ID:
   - Key: Your Firebase UID
   - Value: `true`

Example:
```
admins/
  ├─ "abc123xyz456..." : true
  └─ "another-uid..." : true
```

To find your Firebase UID:
1. Go to **Authentication** tab
2. Find your user
3. Copy the **User UID** value
4. Paste it as a key in the admins node

---

## If You See "Auth permission denied"

This means API Key issues. Fix it:

1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate new private key**
4. Verify API Key is correct in your code

Or temporarily use test rules:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ Warning:** Test rules allow anyone to delete your data. Only use for development!

---

## Quick Checklist

- [ ] Opened Firebase Console
- [ ] Went to Realtime Database → Rules
- [ ] Pasted new rules (not test rules)
- [ ] Clicked Publish
- [ ] Waited for "Rules published" confirmation
- [ ] Reloaded website (Ctrl+F5 to clear cache)
- [ ] Checked console for success logs
- [ ] Products load without "Permission denied" error

---

## If Still Not Working

1. **Check Firebase Status**: https://status.firebase.google.com
2. **Clear Browser Cache**: Press Ctrl+Shift+Delete
3. **Hard Refresh**: Ctrl+F5 (not just F5)
4. **Check API Key**: Verify in `admin.html` and `main.js` match your project
5. **Check Database Region**: Should be same as your API key region

---

## WebSocket Connection Error

The error about `wss://s-gke-usc1-nssi2-25.firebaseio.com/` indicates:
- Firebase SDK is trying to connect ✓
- Rules are blocking it ✓ (FIX: Update rules above)
- Or network firewall is blocking WebSocket ✗ (Less likely)

**Solution: Update Firebase rules (steps above) - this will fix the WebSocket error too.**

---

**Last Updated:** March 3, 2026
