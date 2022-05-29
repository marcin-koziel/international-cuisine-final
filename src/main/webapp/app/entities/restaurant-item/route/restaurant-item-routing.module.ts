import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RestaurantItemComponent } from '../list/restaurant-item.component';
import { RestaurantItemDetailComponent } from '../detail/restaurant-item-detail.component';
import { RestaurantItemUpdateComponent } from '../update/restaurant-item-update.component';
import { RestaurantItemRoutingResolveService } from './restaurant-item-routing-resolve.service';

const restaurantItemRoute: Routes = [
  {
    path: '',
    component: RestaurantItemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RestaurantItemDetailComponent,
    resolve: {
      restaurantItem: RestaurantItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RestaurantItemUpdateComponent,
    resolve: {
      restaurantItem: RestaurantItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RestaurantItemUpdateComponent,
    resolve: {
      restaurantItem: RestaurantItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(restaurantItemRoute)],
  exports: [RouterModule],
})
export class RestaurantItemRoutingModule {}
