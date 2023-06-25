import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../entities/item.entity';
@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemssRepository: Repository<Item>,
  ) {}
  createOrUpdate(item: Item): Promise<Item> {
    return this.itemssRepository.save(item);
  }
  findByOrderId(id: number): Promise<Item[]> {
    return this.itemssRepository.find({
      where: {
        order: { id },
      },
      relations: ['items', 'items.product'],
    });
  }
}
