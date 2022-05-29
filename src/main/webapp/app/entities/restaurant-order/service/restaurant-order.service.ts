import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRestaurantOrder, getRestaurantOrderIdentifier } from '../restaurant-order.model';

export type EntityResponseType = HttpResponse<IRestaurantOrder>;
export type EntityArrayResponseType = HttpResponse<IRestaurantOrder[]>;

@Injectable({ providedIn: 'root' })
export class RestaurantOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/restaurant-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(restaurantOrder: IRestaurantOrder): Observable<EntityResponseType> {
    return this.http.post<IRestaurantOrder>(this.resourceUrl, restaurantOrder, { observe: 'response' });
  }

  update(restaurantOrder: IRestaurantOrder): Observable<EntityResponseType> {
    return this.http.put<IRestaurantOrder>(
      `${this.resourceUrl}/${getRestaurantOrderIdentifier(restaurantOrder) as number}`,
      restaurantOrder,
      { observe: 'response' }
    );
  }

  partialUpdate(restaurantOrder: IRestaurantOrder): Observable<EntityResponseType> {
    return this.http.patch<IRestaurantOrder>(
      `${this.resourceUrl}/${getRestaurantOrderIdentifier(restaurantOrder) as number}`,
      restaurantOrder,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRestaurantOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRestaurantOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRestaurantOrderToCollectionIfMissing(
    restaurantOrderCollection: IRestaurantOrder[],
    ...restaurantOrdersToCheck: (IRestaurantOrder | null | undefined)[]
  ): IRestaurantOrder[] {
    const restaurantOrders: IRestaurantOrder[] = restaurantOrdersToCheck.filter(isPresent);
    if (restaurantOrders.length > 0) {
      const restaurantOrderCollectionIdentifiers = restaurantOrderCollection.map(
        restaurantOrderItem => getRestaurantOrderIdentifier(restaurantOrderItem)!
      );
      const restaurantOrdersToAdd = restaurantOrders.filter(restaurantOrderItem => {
        const restaurantOrderIdentifier = getRestaurantOrderIdentifier(restaurantOrderItem);
        if (restaurantOrderIdentifier == null || restaurantOrderCollectionIdentifiers.includes(restaurantOrderIdentifier)) {
          return false;
        }
        restaurantOrderCollectionIdentifiers.push(restaurantOrderIdentifier);
        return true;
      });
      return [...restaurantOrdersToAdd, ...restaurantOrderCollection];
    }
    return restaurantOrderCollection;
  }
}
