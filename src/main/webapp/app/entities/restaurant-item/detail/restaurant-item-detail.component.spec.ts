import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RestaurantItemDetailComponent } from './restaurant-item-detail.component';

describe('RestaurantItem Management Detail Component', () => {
  let comp: RestaurantItemDetailComponent;
  let fixture: ComponentFixture<RestaurantItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ restaurantItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RestaurantItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RestaurantItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load restaurantItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.restaurantItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
