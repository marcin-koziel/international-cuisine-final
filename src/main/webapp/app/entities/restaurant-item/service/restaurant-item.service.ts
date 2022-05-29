import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRestaurantItem, getRestaurantItemIdentifier } from '../restaurant-item.model';

export type EntityResponseType = HttpResponse<IRestaurantItem>;
export type EntityArrayResponseType = HttpResponse<IRestaurantItem[]>;

@Injectable({ providedIn: 'root' })
export class RestaurantItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/restaurant-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(restaurantItem: IRestaurantItem): Observable<EntityResponseType> {
    return this.http.post<IRestaurantItem>(this.resourceUrl, restaurantItem, { observe: 'response' });
  }

  update(restaurantItem: IRestaurantItem): Observable<EntityResponseType> {
    return this.http.put<IRestaurantItem>(`${this.resourceUrl}/${getRestaurantItemIdentifier(restaurantItem) as number}`, restaurantItem, {
      observe: 'response',
    });
  }

  partialUpdate(restaurantItem: IRestaurantItem): Observable<EntityResponseType> {
    return this.http.patch<IRestaurantItem>(
      `${this.resourceUrl}/${getRestaurantItemIdentifier(restaurantItem) as number}`,
      restaurantItem,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRestaurantItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRestaurantItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRestaurantItemToCollectionIfMissing(
    restaurantItemCollection: IRestaurantItem[],
    ...restaurantItemsToCheck: (IRestaurantItem | null | undefined)[]
  ): IRestaurantItem[] {
    const restaurantItems: IRestaurantItem[] = restaurantItemsToCheck.filter(isPresent);
    if (restaurantItems.length > 0) {
      const restaurantItemCollectionIdentifiers = restaurantItemCollection.map(
        restaurantItemItem => getRestaurantItemIdentifier(restaurantItemItem)!
      );
      const restaurantItemsToAdd = restaurantItems.filter(restaurantItemItem => {
        const restaurantItemIdentifier = getRestaurantItemIdentifier(restaurantItemItem);
        if (restaurantItemIdentifier == null || restaurantItemCollectionIdentifiers.includes(restaurantItemIdentifier)) {
          return false;
        }
        restaurantItemCollectionIdentifiers.push(restaurantItemIdentifier);
        return true;
      });
      return [...restaurantItemsToAdd, ...restaurantItemCollection];
    }
    return restaurantItemCollection;
  }
}
