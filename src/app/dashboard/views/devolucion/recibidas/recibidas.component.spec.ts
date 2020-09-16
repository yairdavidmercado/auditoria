import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibidasComponent } from './recibidas.component';

describe('RecibidasComponent', () => {
  let component: RecibidasComponent;
  let fixture: ComponentFixture<RecibidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecibidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
