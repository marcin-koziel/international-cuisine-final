import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RestaurantItemComponent } from './list/restaurant-item.component';
import { RestaurantItemDetailComponent } from './detail/restaurant-item-detail.component';
import { RestaurantItemUpdateComponent } from './update/restaurant-item-update.component';
import { RestaurantItemDeleteDialogComponent } from './delete/restaurant-item-delete-dialog.component';
import { RestaurantItemRoutingModule } from './route/restaurant-item-routing.module';

@NgModule({
  imports: [SharedModule, RestaurantItemRoutingModule],
  declarations: [
    RestaurantItemComponent,
    RestaurantItemDetailComponent,
    RestaurantItemUpdateComponent,
    RestaurantItemDeleteDialogComponent,
  ],
  entryComponents: [RestaurantItemDeleteDialogComponent],
})
export class RestaurantItemModule {}
