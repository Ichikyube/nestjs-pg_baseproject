import { FileEntity } from './file.entity';
import { User } from './user.entity';
import { Item } from './item.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Role } from './role.entity';

const entities = [User, Item, FileEntity, Order, Product, Role];
export { User, Item, FileEntity, Order, Product, Role };
export default entities;
