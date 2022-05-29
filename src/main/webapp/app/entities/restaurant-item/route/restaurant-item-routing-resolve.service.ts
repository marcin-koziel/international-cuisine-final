import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRestaurantItem, RestaurantItem } from '../restaurant-item.model';
import { RestaurantItemService } from '../service/restaurant-item.service';

@Injectable({ providedIn: 'root' })
export class RestaurantItemRoutingResolveService implements Resolve<IRestaurantItem> {
  constructor(protected service: RestaurantItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRestaurantItem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((restaurantItem: HttpResponse<RestaurantItem>) => {
          if (restaurantItem.body) {
            return of(restaurantItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RestaurantItem());
  }
}
