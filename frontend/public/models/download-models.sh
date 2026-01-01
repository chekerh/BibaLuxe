#!/bin/bash

# Script to download 3D models for BibaLuxe
# Run this from the frontend/public/models directory

echo "Downloading 3D models for BibaLuxe..."

# Create directories
mkdir -p mattress furniture

# Note: These are placeholder URLs. You'll need to:
# 1. Visit the Sketchfab/Polyhaven sites
# 2. Download the models manually
# 3. Place them in the appropriate directories

echo ""
echo "=== MATTRESS MODELS ==="
echo "1. Visit: https://sketchfab.com/3d-models/mattress-2da1d0b25236404f8442ceb1e92a2a48"
echo "   - Click 'Download' button"
echo "   - Select GLB format"
echo "   - Save as: mattress/mattress.glb"
echo ""
echo "2. Visit: https://sketchfab.com/3d-models/simple-mattress-and-pillow-955ca3fefc304a5d9a30ab07dc12541f"
echo "   - Click 'Download' button"
echo "   - Select GLB format"
echo "   - Save as: mattress/mattress-pillow.glb"
echo ""

echo "=== FURNITURE MODELS ==="
echo "1. Visit: https://polyhaven.com/models"
echo "   - Search for 'sofa' or 'chair'"
echo "   - Download GLB format"
echo "   - Save to: furniture/sofa.glb, furniture/chair.glb, etc."
echo ""
echo "2. Visit: https://sketchfab.com/3d-models"
echo "   - Search for 'modern sofa', 'dining chair', 'coffee table'"
echo "   - Filter by 'Free' and 'Downloadable'"
echo "   - Download GLB format"
echo "   - Save to appropriate furniture/ subdirectory"
echo ""

echo "=== ALTERNATIVE: Use placeholder models ==="
echo "The app will work with placeholder geometric shapes until you add real models."
echo ""

echo "Done! After downloading, update the model paths in your product data."

