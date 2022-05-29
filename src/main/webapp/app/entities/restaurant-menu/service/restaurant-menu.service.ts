import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRestaurantMenu, getRestaurantMenuIdentifier } from '../restaurant-menu.model';

export type EntityResponseType = HttpResponse<IRestaurantMenu>;
export type EntityArrayResponseType = HttpResponse<IRestaurantMenu[]>;

@Injectable({ providedIn: 'root' })
export class RestaurantMenuService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/restaurant-menus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(restaurantMenu: IRestaurantMenu): Observable<EntityResponseType> {
    return this.http.post<IRestaurantMenu>(this.resourceUrl, restaurantMenu, { observe: 'response' });
  }

  update(restaurantMenu: IRestaurantMenu): Observable<EntityResponseType> {
    return this.http.put<IRestaurantMenu>(`${this.resourceUrl}/${getRestaurantMenuIdentifier(restaurantMenu) as number}`, restaurantMenu, {
      observe: 'response',
    });
  }

  partialUpdate(restaurantMenu: IRestaurantMenu): Observable<EntityResponseType> {
    return this.http.patch<IRestaurantMenu>(
      `${this.resourceUrl}/${getRestaurantMenuIdentifier(restaurantMenu) as number}`,
      restaurantMenu,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRestaurantMenu>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRestaurantMenu[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRestaurantMenuToCollectionIfMissing(
    restaurantMenuCollection: IRestaurantMenu[],
    ...restaurantMenusToCheck: (IRestaurantMenu | null | undefined)[]
  ): IRestaurantMenu[] {
    const restaurantMenus: IRestaurantMenu[] = restaurantMenusToCheck.filter(isPresent);
    if (restaurantMenus.length > 0) {
      const restaurantMenuCollectionIdentifiers = restaurantMenuCollection.map(
        restaurantMenuItem => getRestaurantMenuIdentifier(restaurantMenuItem)!
      );
      const restaurantMenusToAdd = restaurantMenus.filter(restaurantMenuItem => {
        const restaurantMenuIdentifier = getRestaurantMenuIdentifier(restaurantMenuItem);
        if (restaurantMenuIdentifier == null || restaurantMenuCollectionIdentifiers.includes(restaurantMenuIdentifier)) {
          return false;
        }
        restaurantMenuCollectionIdentifiers.push(restaurantMenuIdentifier);
        return true;
      });
      return [...restaurantMenusToAdd, ...restaurantMenuCollection];
    }
    return restaurantMenuCollection;
  }
}
