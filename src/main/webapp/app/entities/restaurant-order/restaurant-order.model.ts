import { IRestaurantItem } from 'app/entities/restaurant-item/restaurant-item.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';

export interface IRestaurantOrder {
  id?: number;
  quantity?: number | null;
  total?: number | null;
  item?: IRestaurantItem | null;
  transaction?: ITransaction | null;
}

export class RestaurantOrder implements IRestaurantOrder {
  constructor(
    public id?: number,
    public quantity?: number | null,
    public total?: number | null,
    public item?: IRestaurantItem | null,
    public transaction?: ITransaction | null
  ) {}
}

export function getRestaurantOrderIdentifier(restaurantOrder: IRestaurantOrder): number | undefined {
  return restaurantOrder.id;
}
