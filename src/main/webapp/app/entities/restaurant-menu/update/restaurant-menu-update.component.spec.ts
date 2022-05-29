import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RestaurantMenuService } from '../service/restaurant-menu.service';
import { IRestaurantMenu, RestaurantMenu } from '../restaurant-menu.model';

import { RestaurantMenuUpdateComponent } from './restaurant-menu-update.component';

describe('RestaurantMenu Management Update Component', () => {
  let comp: RestaurantMenuUpdateComponent;
  let fixture: ComponentFixture<RestaurantMenuUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let restaurantMenuService: RestaurantMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RestaurantMenuUpdateComponent],
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
      .overrideTemplate(RestaurantMenuUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RestaurantMenuUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    restaurantMenuService = TestBed.inject(RestaurantMenuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const restaurantMenu: IRestaurantMenu = { id: 456 };

      activatedRoute.data = of({ restaurantMenu });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(restaurantMenu));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantMenu>>();
      const restaurantMenu = { id: 123 };
      jest.spyOn(restaurantMenuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantMenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurantMenu }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(restaurantMenuService.update).toHaveBeenCalledWith(restaurantMenu);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantMenu>>();
      const restaurantMenu = new RestaurantMenu();
      jest.spyOn(restaurantMenuService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantMenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: restaurantMenu }));
      saveSubject.complete();

      // THEN
      expect(restaurantMenuService.create).toHaveBeenCalledWith(restaurantMenu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RestaurantMenu>>();
      const restaurantMenu = { id: 123 };
      jest.spyOn(restaurantMenuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ restaurantMenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(restaurantMenuService.update).toHaveBeenCalledWith(restaurantMenu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
