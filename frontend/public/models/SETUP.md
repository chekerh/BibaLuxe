# 3D Models Setup Guide

## Quick Start

1. **Download Models**: Follow the links in `MODEL_SOURCES.md`
2. **Place Files**: Put downloaded `.glb` files in the appropriate directories:
   - Mattresses → `mattress/` folder
   - Furniture → `furniture/` folder
3. **Test**: The app will automatically use placeholders until real models are added

## Directory Structure

```
frontend/public/models/
├── mattress/
│   ├── mattress.glb          (Main mattress model)
│   └── mattress-pillow.glb   (Mattress with pillow)
├── furniture/
│   ├── sofa-modern.glb       (Modern sofa)
│   ├── chair-modern.glb      (Modern chair)
│   ├── table-dining.glb      (Dining table)
│   └── [other furniture].glb
├── MODEL_SOURCES.md          (Download links)
├── SETUP.md                  (This file)
└── README.md                 (Original guide)
```

## Recommended Models to Download

### Priority 1 (Homepage Display)
1. **Mattress**: `/models/mattress/mattress.glb`
   - Source: [Sketchfab - Low Poly Mattress](https://sketchfab.com/3d-models/mattress-2da1d0b25236404f8442ceb1e92a2a48)
   - Used in: Homepage hero section

2. **Sofa**: `/models/furniture/sofa-modern.glb`
   - Source: [Poly Haven](https://polyhaven.com/models) or [Sketchfab](https://sketchfab.com)
   - Used in: Homepage hero section

### Priority 2 (Product Pages)
3. **Chair**: `/models/furniture/chair-modern.glb`
   - For: Recliner Chair product
   
4. **Dining Table**: `/models/furniture/table-dining.glb`
   - For: Dining Table Set product

## How It Works

### Placeholder System
- If a model file doesn't exist, the app automatically shows a **black/white geometric placeholder**
- Placeholders are category-specific (mattress, sofa, chair, etc.)
- No errors will occur - the app gracefully falls back

### Model Configuration
- **Scaling**: Automatically adjusted based on category
- **Camera**: Positioned optimally for each furniture type
- **Lighting**: Enhanced 3-point lighting system
- **Rotation**: Auto-rotates for better viewing

## Testing

1. **Without Models**: App works with placeholders (current state)
2. **With Models**: 
   - Download and place models
   - Refresh browser
   - Models should appear automatically

## File Size Guidelines

- **Ideal**: Under 2MB per model
- **Maximum**: 5MB per model
- **Optimization**: Use GLB format (compressed binary)

## Next Steps

1. Visit the model sources listed in `MODEL_SOURCES.md`
2. Download models in GLB format
3. Place them in the correct directories
4. Refresh your browser to see them!

The app is ready to display your 3D models as soon as you add them! 🎉

