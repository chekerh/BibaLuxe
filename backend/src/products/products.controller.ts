import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Throttle } from '@nestjs/throttler';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for POST
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute for GET
  findAll(
    @Query('category') category?: string,
    @Query('locale') locale?: string,
  ) {
    // Security: Validate category input
    if (category && !['mattress', 'furniture'].includes(category)) {
      throw new BadRequestException('Invalid category');
    }
    // Security: Validate locale (handled in service, but validate here too)
    if (locale && !['en', 'fr', 'ar'].includes(locale)) {
      throw new BadRequestException('Invalid locale');
    }
    return this.productsService.findAll(category, locale);
  }

  @Get(':id')
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  findOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('locale') locale?: string,
  ) {
    // Security: ParseMongoIdPipe validates MongoDB ObjectId format
    // Security: Validate locale
    if (locale && !['en', 'fr', 'ar'].includes(locale)) {
      throw new BadRequestException('Invalid locale');
    }
    return this.productsService.findOne(id, locale);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute for PATCH
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for DELETE
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}

