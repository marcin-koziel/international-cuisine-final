import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RestaurantMenuComponent } from './list/restaurant-menu.component';
import { RestaurantMenuDetailComponent } from './detail/restaurant-menu-detail.component';
import { RestaurantMenuUpdateComponent } from './update/restaurant-menu-update.component';
import { RestaurantMenuDeleteDialogComponent } from './delete/restaurant-menu-delete-dialog.component';
import { RestaurantMenuRoutingModule } from './route/restaurant-menu-routing.module';

@NgModule({
  imports: [SharedModule, RestaurantMenuRoutingModule],
  declarations: [
    RestaurantMenuComponent,
    RestaurantMenuDetailComponent,
    RestaurantMenuUpdateComponent,
    RestaurantMenuDeleteDialogComponent,
  ],
  entryComponents: [RestaurantMenuDeleteDialogComponent],
})
export class RestaurantMenuModule {}
