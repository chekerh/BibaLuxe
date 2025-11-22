import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../products/schemas/product.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  const sampleProducts = [
    {
      name: 'Luxury Memory Foam Mattress',
      price: 1299.99,
      description: 'Premium memory foam mattress with cooling gel layer for the ultimate sleep experience. Features advanced pressure relief and motion isolation.',
      category: 'mattress',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
      specifications: {
        size: 'King',
        material: 'Memory Foam',
        firmness: 'Medium',
        warranty: '15 years',
        thickness: '12 inches',
      },
      inStock: true,
    },
    {
      name: 'Classic Spring Mattress',
      price: 899.99,
      description: 'Traditional innerspring mattress with pocket coils for excellent support and breathability. Perfect for those who prefer a firmer feel.',
      category: 'mattress',
      image: 'https://images.unsplash.com/photo-1631889993954-6367eeb7c4e0?w=800',
      specifications: {
        size: 'Queen',
        material: 'Innerspring',
        firmness: 'Firm',
        warranty: '10 years',
        thickness: '10 inches',
      },
      inStock: true,
    },
    {
      name: 'Hybrid Comfort Mattress',
      price: 1499.99,
      description: 'Best of both worlds - combines memory foam comfort with innerspring support. Features a plush pillow top for added luxury.',
      category: 'mattress',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      specifications: {
        size: 'Cal King',
        material: 'Hybrid',
        firmness: 'Medium-Firm',
        warranty: '20 years',
        thickness: '14 inches',
      },
      inStock: true,
    },
    {
      name: 'Modern Sofa Set',
      price: 2499.99,
      description: 'Contemporary 3-piece sofa set with premium leather upholstery. Features deep cushions and elegant design perfect for any living room.',
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      specifications: {
        pieces: '3',
        material: 'Leather',
        color: 'Brown',
        warranty: '5 years',
        dimensions: '120" x 36" x 34"',
      },
      inStock: true,
    },
    {
      name: 'Elegant Dining Table Set',
      price: 1899.99,
      description: 'Beautiful wooden dining table with 6 matching chairs. Crafted from solid oak with a rich finish that complements any decor.',
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      specifications: {
        pieces: '7',
        material: 'Solid Oak',
        color: 'Natural Wood',
        warranty: '3 years',
        tableSize: '72" x 36"',
      },
      inStock: true,
    },
    {
      name: 'Comfortable Recliner Chair',
      price: 799.99,
      description: 'Premium recliner chair with built-in massage function and USB charging port. Perfect for relaxation after a long day.',
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
      specifications: {
        material: 'Fabric',
        color: 'Gray',
        features: 'Massage, USB Port, Cup Holder',
        warranty: '2 years',
        weightCapacity: '300 lbs',
      },
      inStock: true,
    },
  ];

  console.log('Seeding database with sample products...');
  
  for (const product of sampleProducts) {
    try {
      await productsService.create(product);
      console.log(`✓ Created: ${product.name}`);
    } catch (error) {
      console.error(`✗ Failed to create ${product.name}:`, error.message);
    }
  }

  console.log('\nSeeding completed!');
  await app.close();
}

bootstrap();

