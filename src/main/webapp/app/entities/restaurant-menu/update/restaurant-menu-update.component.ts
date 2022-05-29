import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRestaurantMenu, RestaurantMenu } from '../restaurant-menu.model';
import { RestaurantMenuService } from '../service/restaurant-menu.service';

@Component({
  selector: 'jhi-restaurant-menu-update',
  templateUrl: './restaurant-menu-update.component.html',
})
export class RestaurantMenuUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
  });

  constructor(
    protected restaurantMenuService: RestaurantMenuService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurantMenu }) => {
      this.updateForm(restaurantMenu);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const restaurantMenu = this.createFromForm();
    if (restaurantMenu.id !== undefined) {
      this.subscribeToSaveResponse(this.restaurantMenuService.update(restaurantMenu));
    } else {
      this.subscribeToSaveResponse(this.restaurantMenuService.create(restaurantMenu));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurantMenu>>): void {
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

  protected updateForm(restaurantMenu: IRestaurantMenu): void {
    this.editForm.patchValue({
      id: restaurantMenu.id,
      title: restaurantMenu.title,
    });
  }

  protected createFromForm(): IRestaurantMenu {
    return {
      ...new RestaurantMenu(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
    };
  }
}
