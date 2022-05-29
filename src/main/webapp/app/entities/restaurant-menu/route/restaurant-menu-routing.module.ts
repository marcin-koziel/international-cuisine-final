import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RestaurantMenuComponent } from '../list/restaurant-menu.component';
import { RestaurantMenuDetailComponent } from '../detail/restaurant-menu-detail.component';
import { RestaurantMenuUpdateComponent } from '../update/restaurant-menu-update.component';
import { RestaurantMenuRoutingResolveService } from './restaurant-menu-routing-resolve.service';

const restaurantMenuRoute: Routes = [
  {
    path: '',
    component: RestaurantMenuComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RestaurantMenuDetailComponent,
    resolve: {
      restaurantMenu: RestaurantMenuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RestaurantMenuUpdateComponent,
    resolve: {
      restaurantMenu: RestaurantMenuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RestaurantMenuUpdateComponent,
    resolve: {
      restaurantMenu: RestaurantMenuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(restaurantMenuRoute)],
  exports: [RouterModule],
})
export class RestaurantMenuRoutingModule {}
