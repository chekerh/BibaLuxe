import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, MultilingualText } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  getLocalizedText,
  getLocalizedArray,
  getLocaleFromRequest,
  Locale,
} from './utils/localization.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  /**
   * Localize a product based on locale
   */
  private localizeProduct(product: ProductDocument, locale: Locale): any {
    return {
      ...product.toObject(),
      name: getLocalizedText(product.name, locale),
      tagline: getLocalizedText(product.tagline, locale),
      description: getLocalizedText(product.description, locale),
      highlights: product.highlights ? product.highlights.map(h => getLocalizedText(h, locale)) : [],
      shippingInfo: getLocalizedText(product.shippingInfo, locale),
      // Specifications need to be localized too
      specifications: product.specifications ? 
        Object.entries(product.specifications).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: getLocalizedText(value, locale)
        }), {}) : {},
    };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(category?: string, locale?: string): Promise<any[]> {
    const loc = getLocaleFromRequest(locale);
    let products: ProductDocument[];

    if (category) {
      products = await this.productModel.find({ category }).exec();
    } else {
      products = await this.productModel.find().exec();
    }

    // Localize all products
    return products.map((product) => this.localizeProduct(product, loc));
  }

  async findOne(id: string, locale?: string): Promise<any> {
    // Security: Additional validation
    if (!id || id.trim().length === 0) {
      throw new NotFoundException('Invalid product ID');
    }
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const loc = getLocaleFromRequest(locale);
    return this.localizeProduct(product, loc);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Ensure we handle partial updates for multilingual fields correctly
    const existingProduct = await this.productModel.findById(id).exec();
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const updateObject: any = { ...updateProductDto };

    // Handle multilingual text fields (name, tagline, description, shippingInfo)
    if (updateProductDto.name) {
      updateObject.name = { ...existingProduct.name, ...(updateProductDto.name as MultilingualText) };
    }
    if (updateProductDto.tagline) {
      updateObject.tagline = { ...existingProduct.tagline, ...(updateProductDto.tagline as MultilingualText) };
    }
    if (updateProductDto.description) {
      updateObject.description = { ...existingProduct.description, ...(updateProductDto.description as MultilingualText) };
    }
    if (updateProductDto.shippingInfo) {
      updateObject.shippingInfo = { ...existingProduct.shippingInfo, ...(updateProductDto.shippingInfo as MultilingualText) };
    }

    // Handle highlights (array of MultilingualText)
    if (updateProductDto.highlights) {
      updateObject.highlights = updateProductDto.highlights;
    }

    // Handle specifications (Record<string, MultilingualText>)
    if (updateProductDto.specifications) {
      updateObject.specifications = { ...existingProduct.specifications, ...updateProductDto.specifications };
    }

    return this.productModel
      .findByIdAndUpdate(id, updateObject, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }
    return deletedProduct;
  }
}
