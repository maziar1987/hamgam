import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  // Retrieves the value JSON object (or NULL if none)
  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      var item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    }
    return null;
  }

  // Persist value into localStorage or removes it if a NULL argument is given
  setItem(key: string, item: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (item) {
        localStorage.setItem(key, JSON.stringify(item));
      }
      else {
        localStorage.removeItem(key);
      }
    }
  }

  removeItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
}
