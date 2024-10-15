import { HttpInterceptorFn } from '@angular/common/http';

export const testInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  // Check if localStorage is available before trying to access it
  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('token');
  }

  // Clone the request to add the new headers
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
  }

  // Pass on the cloned request instead of the original request
  //because u cannot modify original req
  
  return next(authReq);

  
};
