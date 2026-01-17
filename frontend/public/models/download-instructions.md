# Download Instructions for 3D Models

## Quick Download Guide

Since automatic downloads from Sketchfab/Polyhaven require manual steps, here's the easiest way to get the models:

### Option 1: Manual Download (Recommended)

1. **Mattress Model**:
   - Visit: https://sketchfab.com/3d-models/mattress-2da1d0b25236404f8442ceb1e92a2a48
   - Click the "Download" button (may require free account)
   - Select "GLB" format
   - Save as: `frontend/public/models/mattress/mattress.glb`

2. **Sofa Model**:
   - Visit: https://polyhaven.com/models (search for "sofa")
   - OR: https://sketchfab.com (search "modern sofa", filter by "Free" and "Downloadable")
   - Download GLB format
   - Save as: `frontend/public/models/furniture/sofa-modern.glb`

3. **Chair Model**:
   - Visit: https://polyhaven.com/models (search for "chair")
   - Download GLB format
   - Save as: `frontend/public/models/furniture/chair-modern.glb`

4. **Table Model**:
   - Visit: https://polyhaven.com/models (search for "table")
   - Download GLB format
   - Save as: `frontend/public/models/furniture/table-dining.glb`

### Option 2: Use Placeholder System (Current)

The app currently works with **black/white geometric placeholders** that automatically display based on category. This works perfectly for development and testing!

### Option 3: Alternative Sources

If Sketchfab/Polyhaven don't work:
- **CGTrader Free Section**: https://www.cgtrader.com/free-3d-models
- **TurboSquid Free**: https://www.turbosquid.com (filter by "Free")
- **Free3D**: https://free3d.com

## File Verification

After downloading, verify the files:
```bash
cd frontend/public/models
ls -lh mattress/
ls -lh furniture/
```

Files should be `.glb` format and ideally under 5MB each.

## Current Status

✅ Placeholder files created
✅ App configured to use models
✅ Automatic fallback to placeholders if models missing
⏳ Waiting for actual GLB files to be downloaded

The app is fully functional with placeholders and will automatically switch to real models once you add them!

