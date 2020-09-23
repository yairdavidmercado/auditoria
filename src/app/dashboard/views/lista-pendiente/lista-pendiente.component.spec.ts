import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPendienteComponent } from './lista-pendiente.component';

describe('ListaPendienteComponent', () => {
  let component: ListaPendienteComponent;
  let fixture: ComponentFixture<ListaPendienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPendienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
