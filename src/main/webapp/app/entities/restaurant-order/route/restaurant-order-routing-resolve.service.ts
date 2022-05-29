import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRestaurantOrder, RestaurantOrder } from '../restaurant-order.model';
import { RestaurantOrderService } from '../service/restaurant-order.service';

@Injectable({ providedIn: 'root' })
export class RestaurantOrderRoutingResolveService implements Resolve<IRestaurantOrder> {
  constructor(protected service: RestaurantOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRestaurantOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((restaurantOrder: HttpResponse<RestaurantOrder>) => {
          if (restaurantOrder.body) {
            return of(restaurantOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RestaurantOrder());
  }
}
