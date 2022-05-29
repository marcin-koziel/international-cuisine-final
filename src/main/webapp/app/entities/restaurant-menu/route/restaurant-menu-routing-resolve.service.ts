import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRestaurantMenu, RestaurantMenu } from '../restaurant-menu.model';
import { RestaurantMenuService } from '../service/restaurant-menu.service';

@Injectable({ providedIn: 'root' })
export class RestaurantMenuRoutingResolveService implements Resolve<IRestaurantMenu> {
  constructor(protected service: RestaurantMenuService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRestaurantMenu> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((restaurantMenu: HttpResponse<RestaurantMenu>) => {
          if (restaurantMenu.body) {
            return of(restaurantMenu.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RestaurantMenu());
  }
}
