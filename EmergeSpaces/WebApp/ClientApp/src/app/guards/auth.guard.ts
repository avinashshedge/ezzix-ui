import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        if (localStorage.getItem('token')) {
            // logged in so return true
            let role = localStorage.getItem('role').replace(/["']/g, "");
            if (route.data.roles && route.data.roles.indexOf(role) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/authentication/login']);
                return false;
            }
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
