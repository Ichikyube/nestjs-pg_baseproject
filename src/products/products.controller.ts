import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Render('products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Products - Online Store';
    viewData['subtitle'] = 'List of products';
    viewData['products'] = await this.productsService.findAll();
    return {
      viewData: viewData,
    };
  }

  @Get(':id')
  @Render('products/show')
  async show(@Param() params, @Res() response) {
    const product = await this.productsService.findOne(params.id);
    if (product === undefined) {
      return response.redirect('/products');
    }
    const viewData = [];
    viewData['title'] = product.getName() + ' - Online Store';
    viewData['subtitle'] = product.getName() + ' - Product Information';
    viewData['product'] = product;
    return response.render('products/show', { viewData });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
