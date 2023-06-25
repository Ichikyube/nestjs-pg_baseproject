import { Item } from 'src/entities/item.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @Column()
  price: number;

  @OneToMany(() => Item, (item) => item.product)
  items: Item[];

  getId(): number {
    return this.id;
  }
  setId(id: number) {
    this.id = id;
  }
  getName(): string {
    return this.name.toUpperCase();
  }
  setName(name: string) {
    this.name = name;
  }
  getDescription(): string {
    return this.description;
  }
  setDescription(description: string) {
    this.description = description;
  }
  getImage(): string {
    return this.image;
  }
  setImage(image: string) {
    this.image = image;
  }
  getPrice(): number {
    return this.price;
  }
  setPrice(price: number) {
    this.price = price;
  }

  getItems(): Item[] {
    return this.items;
  }

  setItems(items: Item[]) {
    this.items = items;
  }

  static sumPricesByQuantities(products: Product[], productsInSession): number {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total =
        total + products[i].getPrice() * productsInSession[products[i].getId()];
    }
    return total;
  }
}
