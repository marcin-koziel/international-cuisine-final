import { IRestaurantItem } from 'app/entities/restaurant-item/restaurant-item.model';

export interface IRestaurantMenu {
  id?: number;
  title?: string | null;
  items?: IRestaurantItem[] | null;
}

export class RestaurantMenu implements IRestaurantMenu {
  constructor(public id?: number, public title?: string | null, public items?: IRestaurantItem[] | null) {}
}

export function getRestaurantMenuIdentifier(restaurantMenu: IRestaurantMenu): number | undefined {
  return restaurantMenu.id;
}
