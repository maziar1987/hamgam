import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTHENTICATE_COOKIE_NAME = 'authenticate';

  constructor(
    private cookieService: CookieService
  ) {
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get(this.AUTHENTICATE_COOKIE_NAME);
  }
}
