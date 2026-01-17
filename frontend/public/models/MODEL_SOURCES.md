# 3D Model Sources & Download Guide

## Quick Start

1. **Download models** from the sources below
2. **Place them** in `frontend/public/models/` directory
3. **Update product data** with model paths (e.g., `/models/mattress.glb`)

## Recommended Mattress Models

### 1. Low-Poly Mattress (Recommended)
- **Source**: [Sketchfab - Mattress by SPietras](https://sketchfab.com/3d-models/mattress-2da1d0b25236404f8442ceb1e92a2a48)
- **Format**: GLB
- **Size**: Small (~500KB)
- **License**: Check Sketchfab license (usually CC Attribution)
- **Download**: Click "Download" → Select "GLB" → Save as `mattress.glb`

### 2. Mattress with Pillow
- **Source**: [Sketchfab - Simple Mattress and Pillow](https://sketchfab.com/3d-models/simple-mattress-and-pillow-955ca3fefc304a5d9a30ab07dc12541f)
- **Format**: GLB
- **Size**: Medium (~2MB)
- **License**: Check Sketchfab license
- **Download**: Click "Download" → Select "GLB" → Save as `mattress-pillow.glb`

### 3. Premium Mattress Model
- **Source**: [Sketchfab - Old Mattress](https://sketchfab.com/3d-models/old-mattress-f8bca903fda348568e18adc33884103d)
- **Format**: GLB
- **Size**: Large (~5MB)
- **Note**: May need optimization for web

## Recommended Furniture Models

### Sofas
1. **Modern Sofa**
   - **Source**: [Poly Haven](https://polyhaven.com/models) - Search "sofa"
   - **Format**: GLB
   - **Save as**: `furniture/sofa-modern.glb`

2. **Luxury Sofa**
   - **Source**: [Sketchfab](https://sketchfab.com/3d-models) - Search "luxury sofa"
   - **Format**: GLB
   - **Save as**: `furniture/sofa-luxury.glb`

### Chairs
1. **Modern Chair**
   - **Source**: [Poly Haven](https://polyhaven.com/models) - Search "chair"
   - **Format**: GLB
   - **Save as**: `furniture/chair-modern.glb`

2. **Dining Chair**
   - **Source**: [Sketchfab](https://sketchfab.com/3d-models) - Search "dining chair"
   - **Format**: GLB
   - **Save as**: `furniture/chair-dining.glb`

### Tables
1. **Coffee Table**
   - **Source**: [Poly Haven](https://polyhaven.com/models) - Search "table"
   - **Format**: GLB
   - **Save as**: `furniture/table-coffee.glb`

2. **Dining Table**
   - **Source**: [Sketchfab](https://sketchfab.com/3d-models) - Search "dining table"
   - **Format**: GLB
   - **Save as**: `furniture/table-dining.glb`

## Alternative Sources

### Free Model Libraries
- **Poly Haven**: https://polyhaven.com/models (CC0, high quality)
- **Sketchfab**: https://sketchfab.com (Filter by "Free" and "Downloadable")
- **TurboSquid**: https://www.turbosquid.com (Free section)
- **CGTrader**: https://www.cgtrader.com (Free models section)
- **Free3D**: https://free3d.com

### Premium Options
- **Design Connected**: Premium furniture models
- **3DMaxter**: Professional quality models

## File Organization

```
frontend/public/models/
├── mattress/
│   ├── mattress.glb
│   ├── mattress-pillow.glb
│   └── mattress-premium.glb
├── furniture/
│   ├── sofa-modern.glb
│   ├── sofa-luxury.glb
│   ├── chair-modern.glb
│   ├── chair-dining.glb
│   ├── table-coffee.glb
│   └── table-dining.glb
└── README.md
```

## Optimization Tips

1. **File Size**: Keep models under 5MB for web use
2. **Polygon Count**: Aim for 5K-20K triangles for good performance
3. **Textures**: Use compressed textures (JPEG/WebP)
4. **Format**: Prefer GLB over GLTF (smaller file size)
5. **DRACO Compression**: Consider using DRACO for further compression

## Testing Models

After adding models:
1. Check browser console for loading errors
2. Verify models display correctly
3. Test on mobile devices
4. Monitor loading performance

## License Notes

- Always check license terms before using models
- Most free models require attribution
- Commercial use may require different licenses
- Keep track of model sources for attribution

