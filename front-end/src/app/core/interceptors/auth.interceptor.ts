import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageManagerService } from '../../services/auth/local-storage-manager.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageManager = inject(LocalStorageManagerService);
  const authToken = localStorageManager.getToken();
  
  const excludedUrls = [
    'http://localhost:8080/clients/register',
    'http://localhost:8080/auth/login',
    'http://localhost:8080/doctors/register',
    'http://localhost:8080/departments/all',
  ];

  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req); 
  }
  
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  return next(req);
};
