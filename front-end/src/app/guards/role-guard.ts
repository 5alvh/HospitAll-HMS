import { Router } from "@angular/router";
import { LocalStorageManagerService } from "../services/auth/local-storage-manager.service";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private localS: LocalStorageManagerService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.localS.getUserData();

    if (userRole === expectedRole) {
      return true;
    }else if (userRole === null) {
      this.localS.clearAuth();
      this.router.navigate(['/']);
      return false;
    } 
    else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}