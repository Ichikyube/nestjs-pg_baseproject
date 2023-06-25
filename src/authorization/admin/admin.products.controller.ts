import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductValidator } from 'src/utils/validators/product.validator';
import * as fs from 'fs';
import { ProductsService } from 'src/features/products/products.service';
import { Product } from 'src/entities/product.entity';

@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  @Render('admin/products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Admin - Online Store';
    viewData['products'] = await this.productsService.findAll();
    return {
      viewData: viewData,
    };
  }
  @Post('store')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async store(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ) {
    const toValidate: string[] = [
      'name',
      'description',
      'price',
      'imageCreate',
    ];
    const errors: string[] = ProductValidator.validate(body, file, toValidate);
    if (errors.length > 0) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      request.session.flashErrors = errors;
    } else {
      const newProduct = new Product();
      newProduct.setName(body.name);
      newProduct.setDescription(body.description);
      newProduct.setPrice(body.price);
      newProduct.setImage(file.filename);
      await this.productsService.createOrUpdate(newProduct);
    }
  }
  @Post('/:id')
  @Redirect('/admin/products')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
  @Get('/:id')
  @Render('admin/products/edit')
  async edit(@Param('id') id: string) {
    const viewData = [];
    viewData['title'] = 'Admin Page - Edit Product - Online Store';
    viewData['product'] = await this.productsService.findOne(Number(id));
    return {
      viewData: viewData,
    };
  }
  @Post('/:id/update')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async update(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const product = await this.productsService.findOne(Number(id));
    product.setName(body.name);
    product.setDescription(body.description);
    product.setPrice(body.price);
    if (file) {
      product.setImage(file.filename);
    }
    await this.productsService.createOrUpdate(product);
  }
}
