import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  GithubOutline,
  LoginOutline,
  LogoutOutline,
  MoonOutline,
  SunOutline
} from '@ant-design/icons-angular/icons';
import { provideStore } from '@ngrx/store';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { App } from './app';
import { appReducer } from './store/app.reducer';
import { authReducer } from './store/auth/auth.reducer';
import { exerciseReducer } from './store/exercise/exercise.reducer';
import { settingsReducer } from './store/settings/settings.reducer';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, NzModalModule],
      providers: [
        provideRouter([]),
        provideNzIcons([GithubOutline, LoginOutline, LogoutOutline, MoonOutline, SunOutline]),
        provideStore({
          app: appReducer,
          exercise: exerciseReducer,
          auth: authReducer,
          settings: settingsReducer
        })
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
