import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RestaurantMenuDetailComponent } from './restaurant-menu-detail.component';

describe('RestaurantMenu Management Detail Component', () => {
  let comp: RestaurantMenuDetailComponent;
  let fixture: ComponentFixture<RestaurantMenuDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantMenuDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ restaurantMenu: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RestaurantMenuDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RestaurantMenuDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load restaurantMenu on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.restaurantMenu).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
