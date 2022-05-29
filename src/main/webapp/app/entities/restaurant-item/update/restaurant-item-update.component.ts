import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRestaurantItem, RestaurantItem } from '../restaurant-item.model';
import { RestaurantItemService } from '../service/restaurant-item.service';
import { IRestaurantMenu } from 'app/entities/restaurant-menu/restaurant-menu.model';
import { RestaurantMenuService } from 'app/entities/restaurant-menu/service/restaurant-menu.service';

@Component({
  selector: 'jhi-restaurant-item-update',
  templateUrl: './restaurant-item-update.component.html',
})
export class RestaurantItemUpdateComponent implements OnInit {
  isSaving = false;

  restaurantMenusSharedCollection: IRestaurantMenu[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    summary: [],
    price: [],
    itemDiscount: [],
    restaurantMenu: [],
  });

  constructor(
    protected restaurantItemService: RestaurantItemService,
    protected restaurantMenuService: RestaurantMenuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurantItem }) => {
      this.updateForm(restaurantItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const restaurantItem = this.createFromForm();
    if (restaurantItem.id !== undefined) {
      this.subscribeToSaveResponse(this.restaurantItemService.update(restaurantItem));
    } else {
      this.subscribeToSaveResponse(this.restaurantItemService.create(restaurantItem));
    }
  }

  trackRestaurantMenuById(_index: number, item: IRestaurantMenu): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurantItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(restaurantItem: IRestaurantItem): void {
    this.editForm.patchValue({
      id: restaurantItem.id,
      title: restaurantItem.title,
      summary: restaurantItem.summary,
      price: restaurantItem.price,
      itemDiscount: restaurantItem.itemDiscount,
      restaurantMenu: restaurantItem.restaurantMenu,
    });

    this.restaurantMenusSharedCollection = this.restaurantMenuService.addRestaurantMenuToCollectionIfMissing(
      this.restaurantMenusSharedCollection,
      restaurantItem.restaurantMenu
    );
  }

  protected loadRelationshipsOptions(): void {
    this.restaurantMenuService
      .query()
      .pipe(map((res: HttpResponse<IRestaurantMenu[]>) => res.body ?? []))
      .pipe(
        map((restaurantMenus: IRestaurantMenu[]) =>
          this.restaurantMenuService.addRestaurantMenuToCollectionIfMissing(restaurantMenus, this.editForm.get('restaurantMenu')!.value)
        )
      )
      .subscribe((restaurantMenus: IRestaurantMenu[]) => (this.restaurantMenusSharedCollection = restaurantMenus));
  }

  protected createFromForm(): IRestaurantItem {
    return {
      ...new RestaurantItem(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      summary: this.editForm.get(['summary'])!.value,
      price: this.editForm.get(['price'])!.value,
      itemDiscount: this.editForm.get(['itemDiscount'])!.value,
      restaurantMenu: this.editForm.get(['restaurantMenu'])!.value,
    };
  }
}
