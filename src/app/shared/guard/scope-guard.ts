import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,ActivatedRoute } from "@angular/router";
import { Injectable } from "@angular/core";
/**
 * Guard component to check that user is logged and can loading page
 */
@Injectable({
    providedIn: 'root'
})
export class ScopeGuard implements CanActivate {
    constructor(private router: Router,private activated: ActivatedRoute) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return false
    }
}