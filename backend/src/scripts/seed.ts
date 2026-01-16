import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../products/schemas/product.schema';
import { MultilingualTextDto } from '../products/dto/create-product.dto'; // Import MultilingualTextDto

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  // Helper function to convert a string to MultilingualTextDto
  const toMultilingualTextDto = (en: string, ar: string, fr: string): MultilingualTextDto => ({
    en,
    ar,
    fr,
  });

  const sampleProducts = [
    {
      name: toMultilingualTextDto('Luxury Memory Foam Mattress', 'مرتبة إسفنجية فاخرة', 'Matelas en mousse à mémoire de forme de luxe'),
      tagline: toMultilingualTextDto('Cooling support for deeper sleep', 'دعم تبريد لنوم أعمق', 'Support rafraîchissant pour un sommeil plus profond'),
      price: 1299.99,
      description: toMultilingualTextDto(
        'Premium memory foam mattress with cooling gel layer for the ultimate sleep experience. Features advanced pressure relief and motion isolation.',
        'مرتبة إسفنجية فاخرة مع طبقة جل مبردة لتجربة نوم مثالية. تتميز بتخفيف متقدم للضغط وعزل الحركة.',
        'Matelas en mousse à mémoire de forme premium avec couche de gel rafraîchissant pour une expérience de sommeil ultime. Comprend un soulagement avancé de la pression et une isolation des mouvements.'
      ),
      category: 'mattress',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
      model3d: '/models/mattress/mattress-new.glb',
      highlights: [
        toMultilingualTextDto('Cooling gel layer dissipates heat all night', 'طبقة الجل المبردة تبدد الحرارة طوال الليل', 'La couche de gel rafraîchissant dissipe la chaleur toute la nuit'),
        toMultilingualTextDto('Zoned pressure relief for shoulders and hips', 'تخفيف الضغط الموزع للكتفين والوركين', 'Soulagement zonal de la pression pour les épaules et les hanches'),
        toMultilingualTextDto('Delivered in 3-5 days with white-glove setup', 'يتم التوصيل خلال 3-5 أيام مع إعداد بالقفازات البيضاء', 'Livré en 3-5 jours avec installation mains blanches'),
      ],
      rating: 4.8,
      reviewsCount: 842,
      shippingInfo: toMultilingualTextDto('Free 2–5 day delivery & optional white-glove setup', 'توصيل مجاني خلال 2-5 أيام وإعداد بالقفازات البيضاء اختياري', 'Livraison gratuite en 2-5 jours et installation mains blanches optionnelle'),
      warrantyYears: 15,
      specifications: {
        size: toMultilingualTextDto('King', 'كينغ', 'King'),
        material: toMultilingualTextDto('Memory Foam', 'رغوة الذاكرة', 'Mousse à mémoire de forme'),
        firmness: toMultilingualTextDto('Medium', 'متوسطة', 'Moyenne'),
        warranty: toMultilingualTextDto('15 years', '15 سنة', '15 ans'),
        thickness: toMultilingualTextDto('12 inches', '12 إنش', '12 pouces'),
      },
      inStock: true,
    },
    {
      name: toMultilingualTextDto('Classic Spring Mattress', 'مرتبة نابضة كلاسيكية', 'Matelas à ressorts classique'),
      tagline: toMultilingualTextDto('Responsive support that breathes', 'دعم متجاوب يتنفس', 'Support réactif qui respire'),
      price: 899.99,
      description: toMultilingualTextDto(
        'Traditional innerspring mattress with pocket coils for excellent support and breathability. Perfect for those who prefer a firmer feel.',
        'مرتبة داخلية نابضة تقليدية مع نوابض مغلفة لدعم ممتاز وتنفسية. مثالية لأولئك الذين يفضلون الشعور الأكثر صلابة.',
        'Matelas à ressorts ensachés traditionnel avec ressorts individuels pour un excellent soutien et respirabilité. Parfait pour ceux qui préfèrent un toucher plus ferme.'
      ),
      category: 'mattress',
      image: 'https://images.unsplash.com/photo-1631889993954-6367eeb7c4e0?w=800',
      model3d: '/models/mattress/mattress-new.glb',
      highlights: [
        toMultilingualTextDto('Individually wrapped coils reduce motion transfer', 'النوابض المغلفة بشكل فردي تقلل من نقل الحركة', 'Les ressorts individuellement enveloppés réduisent le transfert de mouvement'),
        toMultilingualTextDto('Edge-to-edge reinforcement keeps shape for years', 'التعزيز من الحافة إلى الحافة يحافظ على الشكل لسنوات', 'Le renforcement bord à bord maintient la forme pendant des années'),
        toMultilingualTextDto('Ships compressed and ready in under a week', 'يتم الشحن مضغوطاً وجاهزاً في أقل من أسبوع', 'Expédié compressé et prêt en moins d\'une semaine'),
      ],
      rating: 4.6,
      reviewsCount: 612,
      shippingInfo: toMultilingualTextDto('Standard shipping in 4–7 business days', 'الشحن القياسي خلال 4-7 أيام عمل', 'Expédition standard en 4-7 jours ouvrables'),
      warrantyYears: 10,
      specifications: {
        size: toMultilingualTextDto('Queen', 'كوين', 'Queen'),
        material: toMultilingualTextDto('Innerspring', 'داخلية نابضة', 'Ressorts ensachés'),
        firmness: toMultilingualTextDto('Firm', 'صلبة', 'Ferme'),
        warranty: toMultilingualTextDto('10 years', '10 سنوات', '10 ans'),
        thickness: toMultilingualTextDto('10 inches', '10 إنش', '10 pouces'),
      },
      inStock: true,
    },
    {
      name: toMultilingualTextDto('Hybrid Comfort Mattress', 'مرتبة الراحة الهجينة', 'Matelas Confort Hybride'),
      tagline: toMultilingualTextDto('Hybrid plushness with aligned support', 'نعومة هجينة مع دعم محاذى', 'Douceur hybride avec soutien aligné'),
      price: 1499.99,
      description: toMultilingualTextDto(
        'Best of both worlds - combines memory foam comfort with innerspring support. Features a plush pillow top for added luxury.',
        'أفضل العالمين - يجمع بين راحة الإسفنج الذاكري ودعم النوابض الداخلية. يتميز بأعلى وسادة فاخرة للفخامة المضافة.',
        'Le meilleur des deux mondes - combine le confort de la mousse à mémoire de forme avec le soutien des ressorts ensachés. Comprend un dessus oreiller moelleux pour plus de luxe.'
      ),
      category: 'mattress',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      model3d: '/models/mattress/mattress-new.glb',
      highlights: [
        toMultilingualTextDto('Adaptive foam + coils keep perfect alignment', 'الإسفنج التكيفي + النوابض يحافظان على المحاذاة المثالية', 'La mousse adaptative + ressorts maintiennent un alignement parfait'),
        toMultilingualTextDto('Luxury pillow top cradles without overheating', 'أعلى وسادة فاخرة يدعم دون ارتفاع الحرارة', 'Le dessus oreiller de luxe berce sans surchauffe'),
        toMultilingualTextDto('100-night risk-free trial included', 'تجربة 100 ليلة بدون مخاطر مشمولة', 'Essai sans risque de 100 nuits inclus'),
      ],
      rating: 4.9,
      reviewsCount: 1094,
      shippingInfo: toMultilingualTextDto('Free shipping + complimentary setup in select cities', 'الشحن المجاني + الإعداد المجاني في مدن مختارة', 'Expédition gratuite + installation gratuite dans certaines villes'),
      warrantyYears: 20,
      specifications: {
        size: toMultilingualTextDto('Cal King', 'كال كينغ', 'Cal King'),
        material: toMultilingualTextDto('Hybrid', 'هجين', 'Hybride'),
        firmness: toMultilingualTextDto('Medium-Firm', 'متوسط الصلابة', 'Mi-ferme'),
        warranty: toMultilingualTextDto('20 years', '20 سنة', '20 ans'),
        thickness: toMultilingualTextDto('14 inches', '14 إنش', '14 pouces'),
      },
      inStock: true,
    },
    {
      name: toMultilingualTextDto('Modern Sofa Set', 'طقم أريكة عصري', 'Ensemble de canapé moderne'),
      tagline: toMultilingualTextDto('Lounge-worthy leather for every living room', 'جلد يستحق الجلوس لكل غرفة معيشة', 'Cuir digne de salon pour chaque salon'),
      price: 2499.99,
      description: toMultilingualTextDto(
        'Contemporary 3-piece sofa set with premium leather upholstery. Features deep cushions and elegant design perfect for any living room.',
        'طقم أريكة عصري مكون من 3 قطع مع تنجيد جلدي فاخر. يتميز بوسائد عميقة وتصميم أنيق مثالي لأي غرفة معيشة.',
        'Ensemble de canapé 3 pièces contemporain avec revêtement en cuir de première qualité. Comprend des coussins profonds et un design élégant parfait pour tout salon.'
      ),
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      model3d: '/models/furniture/sofa-new.glb',
      highlights: [
        toMultilingualTextDto('Performance leather that resists stains', 'جلد أداء يقاوم البقع', 'Cuir performant qui résiste aux taches'),
        toMultilingualTextDto('High-density foam cushions keep their shape', 'وسائد إسفنج عالية الكثافة تحافظ على شكلها', 'Les coussins en mousse haute densité gardent leur forme'),
        toMultilingualTextDto('Configurable pieces adapt to any space', 'القطع القابلة للتكوين تتكيف مع أي مسpace', 'Les pièces configurables s\'adaptent à tout espace'),
      ],
      rating: 4.7,
      reviewsCount: 384,
      shippingInfo: toMultilingualTextDto('White-glove delivery & assembly in 7–10 days', 'توصيل بالقفازات البيضاء والتركيب خلال 7-10 أيام', 'Livraison mains blanches et montage en 7-10 jours'),
      warrantyYears: 5,
      specifications: {
        pieces: toMultilingualTextDto('3', '3', '3'),
        material: toMultilingualTextDto('Leather', 'جلد', 'Cuir'),
        color: toMultilingualTextDto('Brown', 'بني', 'Marron'),
        warranty: toMultilingualTextDto('5 years', '5 سنوات', '5 ans'),
        dimensions: toMultilingualTextDto('120" x 36" x 34"', '120" × 36" × 34"', '120" x 36" x 34"'),
      },
      inStock: true,
    },
    {
      name: toMultilingualTextDto('Elegant Dining Table Set', 'طقم طاولة طعام أنيق', 'Ensemble de table à manger élégant'),
      tagline: toMultilingualTextDto('Handcrafted dining moments', 'لحظات تناول طعام مصنوعة يدوياً', 'Moments de repas artisanaux'),
      price: 1899.99,
      description: toMultilingualTextDto(
        'Beautiful wooden dining table with 6 matching chairs. Crafted from solid oak with a rich finish that complements any decor.',
        'طاولة طعام خشبية جميلة مع 6 كراسي متطابقة. مصنوعة من خشب البلوط الصلب مع لمسة غنية تكمل أي ديكور.',
        'Belle table à manger en bois avec 6 chaises assorties. Fabriquée en chêne massif avec une finition riche qui complète tout décor.'
      ),
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      model3d: '/models/furniture/table-dining.glb',
      highlights: [
        toMultilingualTextDto('Solid oak sustainably harvested', 'خشب بلوط صلب مستدام', 'Chêne massif récolté de manière durable'),
        toMultilingualTextDto('Protective finish resists spills and scratches', 'اللمسة الواقية تقاوم الانسكابات والخدوش', 'La finition protectrice résiste aux déversements et aux rayures'),
        toMultilingualTextDto('Ergonomic chairs with performance upholstery', 'كراسي مريحة مع تنجيد أداء', 'Chaises ergonomiques avec revêtement performant'),
      ],
      rating: 4.8,
      reviewsCount: 242,
      shippingInfo: toMultilingualTextDto('Scheduled delivery with room-of-choice placement', 'توصيل مجدول مع وضع في الغرفة المختارة', 'Livraison programmée avec placement dans la pièce de choix'),
      warrantyYears: 3,
      specifications: {
        pieces: toMultilingualTextDto('7', '7', '7'),
        material: toMultilingualTextDto('Solid Oak', 'خشب بلوط صلب', 'Chêne massif'),
        color: toMultilingualTextDto('Natural Wood', 'خشب طبيعي', 'Bois naturel'),
        warranty: toMultilingualTextDto('3 years', '3 سنوات', '3 ans'),
        tableSize: toMultilingualTextDto('72" x 36"', '72" × 36"', '72" x 36"'),
      },
      inStock: true,
    },
    {
      name: toMultilingualTextDto('Comfortable Recliner Chair', 'كرسي استرخاء مريح', 'Chaise inclinable confortable'),
      tagline: toMultilingualTextDto('Recharge-ready comfort chair', 'كرسي راحة جاهز للشحن', 'Chaise de confort prête à recharger'),
      price: 799.99,
      description: toMultilingualTextDto(
        'Premium recliner chair with built-in massage function and USB charging port. Perfect for relaxation after a long day.',
        'كرسي استرخاء فاخر مع وظيفة تدليك مدمجة ومنفذ شحن USB. مثالي للاسترخاء بعد يوم طويل.',
        'Chaise inclinable premium avec fonction massage intégrée et port de charge USB. Parfaite pour la relaxation après une longue journée.'
      ),
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
      model3d: '/models/furniture/chair-modern.glb',
      highlights: [
        toMultilingualTextDto('Built-in massage + USB charging port', 'تدليك مدمج + منفذ شحن USB', 'Massage intégré + port de charge USB'),
        toMultilingualTextDto('Premium performance fabric resists wear', 'قماش أداء فاخر يقاوم التآكل', 'Tissu performant premium résiste à l\'usure'),
        toMultilingualTextDto('Zero-clearance wall-hugger design', 'تصميم بدون مسافة يلتصق بالجدار', 'Conception sans espace qui épouse le mur'),
      ],
      rating: 4.5,
      reviewsCount: 518,
      shippingInfo: toMultilingualTextDto('Ships within 3 business days', 'يتم الشحن خلال 3 أيام عمل', 'Expédié sous 3 jours ouvrables'),
      warrantyYears: 2,
      specifications: {
        material: toMultilingualTextDto('Fabric', 'قماش', 'Tissu'),
        color: toMultilingualTextDto('Gray', 'رمادي', 'Gris'),
        features: toMultilingualTextDto('Massage, USB Port, Cup Holder', 'تدليك، منفذ USB، حامل كوب', 'Massage, port USB, porte-gobelet'),
        warranty: toMultilingualTextDto('2 years', 'سنتان', '2 ans'),
        weightCapacity: toMultilingualTextDto('300 lbs', '300 رطل', '300 lbs'),
      },
      inStock: true,
    },
  ];

  console.log('Seeding database with sample products...');

  for (const product of sampleProducts) {
    try {
      // Ensure product is passed as CreateProductDto
      await productsService.create(product as any);
      console.log(`✓ Created: ${product.name.en}`);
    } catch (error) {
      console.error(`✗ Failed to create ${product.name.en}:`, error.message);
    }
  }

  console.log('\nSeeding completed!');
  await app.close();
}

bootstrap();
