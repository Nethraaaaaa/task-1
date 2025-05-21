import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEuComponent } from './fuel-eu.component';

describe('FuelEuComponent', () => {
  let component: FuelEuComponent;
  let fixture: ComponentFixture<FuelEuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelEuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelEuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
