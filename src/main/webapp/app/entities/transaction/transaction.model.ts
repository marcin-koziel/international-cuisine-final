import { IRestaurantOrder } from 'app/entities/restaurant-order/restaurant-order.model';
import { IUser } from 'app/entities/user/user.model';

export interface ITransaction {
  id?: number;
  subTotal?: number | null;
  tax?: number | null;
  total?: number | null;
  lastFourDigits?: string | null;
  restaurantOrders?: IRestaurantOrder[] | null;
  user?: IUser | null;
}

export class Transaction implements ITransaction {
  constructor(
    public id?: number,
    public subTotal?: number | null,
    public tax?: number | null,
    public total?: number | null,
    public lastFourDigits?: string | null,
    public restaurantOrders?: IRestaurantOrder[] | null,
    public user?: IUser | null
  ) {}
}

export function getTransactionIdentifier(transaction: ITransaction): number | undefined {
  return transaction.id;
}
