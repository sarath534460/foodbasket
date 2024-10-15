import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

 let data= inject(AuthService)

  if(data.getlocalstorage()){
    return true
  }
  else{
    return false
  }
};
