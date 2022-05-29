import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurantMenu } from '../restaurant-menu.model';
import { RestaurantMenuService } from '../service/restaurant-menu.service';
import { RestaurantMenuDeleteDialogComponent } from '../delete/restaurant-menu-delete-dialog.component';

@Component({
  selector: 'jhi-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
})
export class RestaurantMenuComponent implements OnInit {
  restaurantMenus?: IRestaurantMenu[];
  isLoading = false;

  constructor(protected restaurantMenuService: RestaurantMenuService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.restaurantMenuService.query().subscribe({
      next: (res: HttpResponse<IRestaurantMenu[]>) => {
        this.isLoading = false;
        this.restaurantMenus = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IRestaurantMenu): number {
    return item.id!;
  }

  delete(restaurantMenu: IRestaurantMenu): void {
    const modalRef = this.modalService.open(RestaurantMenuDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.restaurantMenu = restaurantMenu;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
