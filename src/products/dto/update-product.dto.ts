export class UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  image?: string;
  model3d?: string;
  specifications?: Record<string, any>;
  inStock?: boolean;
}

