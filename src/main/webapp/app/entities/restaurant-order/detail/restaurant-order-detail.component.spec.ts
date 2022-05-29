import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RestaurantOrderDetailComponent } from './restaurant-order-detail.component';

describe('RestaurantOrder Management Detail Component', () => {
  let comp: RestaurantOrderDetailComponent;
  let fixture: ComponentFixture<RestaurantOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ restaurantOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RestaurantOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RestaurantOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load restaurantOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.restaurantOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
