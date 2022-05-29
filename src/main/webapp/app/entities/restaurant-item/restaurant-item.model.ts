import { IRestaurantOrder } from 'app/entities/restaurant-order/restaurant-order.model';
import { IRestaurantMenu } from 'app/entities/restaurant-menu/restaurant-menu.model';

export interface IRestaurantItem {
  id?: number;
  title?: string | null;
  summary?: string | null;
  price?: number | null;
  itemDiscount?: number | null;
  restaurantOrder?: IRestaurantOrder | null;
  restaurantMenu?: IRestaurantMenu | null;
}

export class RestaurantItem implements IRestaurantItem {
  constructor(
    public id?: number,
    public title?: string | null,
    public summary?: string | null,
    public price?: number | null,
    public itemDiscount?: number | null,
    public restaurantOrder?: IRestaurantOrder | null,
    public restaurantMenu?: IRestaurantMenu | null
  ) {}
}

export function getRestaurantItemIdentifier(restaurantItem: IRestaurantItem): number | undefined {
  return restaurantItem.id;
}
