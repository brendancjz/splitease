import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyGuard implements CanDeactivate<any> {
  canDeactivate(component: any): boolean {
    // Add your warning message logic here
    return true; // return false to cancel navigation
  }

}
