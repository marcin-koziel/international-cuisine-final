import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RestaurantItemService } from '../service/restaurant-item.service';
import { IRestaurantItem, RestaurantItem } from '../restaurant-item.model';
import { IRestaurantMenu } from 'app/entities/restaurant-menu/restaurant-menu.model';
import { RestaurantMenuService } from 'app/entities/restaurant-menu/service/restaurant-menu.service';

import { RestaurantItemUpdateComponent } from './restaurant-item-update.component';

describe('RestaurantItem Management Update Component', () => {
  let comp: RestaurantItemUpdateComponent;
  let fixture: ComponentFixture<RestaurantItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let restaurantItemService: RestaurantItemService;
  let restaurantMenuService: RestaurantMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RestaurantItemUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RestaurantItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    restaurantItemService = TestBed.inject(RestaurantItemService);
    restaurantMenuService = TestBed.inject(RestaurantMenuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call RestaurantMenu query and add missing value', () => {
      const restaurantItem: IRestaurantItem = { id: 456 };
      const restaurantMenu: IRestaurantMenu = { id: 54517 };
      restaurantItem.restaurantMenu = restaurantMenu;

      const restaurantMenuCollection: IRestaurantMenu[] = [{ id: 21054 }];
      jest.spyOn(restaurantMenuService, 'query').mockReturnValue(of(new HttpResponse({ body: restaurantMenuCollection })));
      const additionalRestaurantMenus = [restaurantMenu];
      const expectedCollection: IRestaurantMenu[] = [...additionalRestaurantMenus, ...restaurantMenuCollection];
      jest.spyOn(restaurantMenuService, 'addRestaurantMenuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ restaurantItem });
      comp.ngOnInit();

      expect(restaurantMenuService.query).toHaveBeenCalled();
      expect(restaurantMenuService.addRestaurantMenuToCollectionIfMissing).toHaveBeenCalledWith(
        restaurantMenuCollection,
        ...additionalRestaurantMenus
      );
      expect(comp.restaurantMenusSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const restaurantItem: IRestaurantItem = { id: 456 };
      const restaurantMenu: IRestaurantMenu = { id: 6438 };
      restaurantItem.restaurantMenu = restaurantMenu;

      activatedRoute.data = of({ restaurantItem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(restaurantItem));
      expect(comp.restaurantMenusSharedCollection).toContain(restaurantMenu);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantItem>>();
      const restaurantItem = { id: 123 };
      jest.spyOn(restaurantItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurantItem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(restaurantItemService.update).toHaveBeenCalledWith(restaurantItem);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantItem>>();
      const restaurantItem = new RestaurantItem();
      jest.spyOn(restaurantItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurantItem }));
      saveSubject.complete();

      // THEN
      expect(restaurantItemService.create).toHaveBeenCalledWith(restaurantItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantItem>>();
      const restaurantItem = { id: 123 };
      jest.spyOn(restaurantItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(restaurantItemService.update).toHaveBeenCalledWith(restaurantItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRestaurantMenuById', () => {
      it('Should return tracked RestaurantMenu primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRestaurantMenuById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
