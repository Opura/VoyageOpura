import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDrawer } from './search-drawer';

describe('SearchDrawer', () => {
  let component: SearchDrawer;
  let fixture: ComponentFixture<SearchDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
