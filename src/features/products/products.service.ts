import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}
  createOrUpdate(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }
  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id: id });
  }

  findByIds(ids: string[]): Promise<Product[]> {
    return this.productsRepository.findByIds(ids);
  }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
