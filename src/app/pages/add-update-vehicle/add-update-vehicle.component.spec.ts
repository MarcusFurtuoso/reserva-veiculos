import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateVehicleComponent } from './add-update-vehicle.component';

describe('AddUpdateVehicleComponent', () => {
  let component: AddUpdateVehicleComponent;
  let fixture: ComponentFixture<AddUpdateVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
