import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  GithubOutline,
  LoginOutline,
  LogoutOutline,
  MoonOutline,
  SunOutline
} from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, NzModalModule],
      providers: [
        provideRouter([]),
        provideNzIcons([GithubOutline, LoginOutline, LogoutOutline, MoonOutline, SunOutline])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('strong')?.textContent).toContain(
      'The C Programming Language Exercises'
    );
  });
});
