import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  
   validater: boolean | undefined;
  cartservice: any;
  carts: any;
  carttotal: any;
  http: HttpClient;
  cd: ChangeDetectorRef;

  a:any
  showaddress: boolean=true;
  allpayments: boolean=false
  paymentype: any;
  router: Router;
  

  constructor(http:HttpClient,cartservice:CartService,cd:ChangeDetectorRef,router:Router){
    this.router=router
    this.http=http;
    this.cartservice=cartservice
    this.cd=cd
  }

  ngOnInit() {
    this.cartservice.getcartitems().subscribe((u:any)=>
      {
        console.log(u)
        this.carts=u
    
        this.carttotal=this.carts.reduce((accumulator:any, currentValue:any) => {
          return accumulator + currentValue.itemtotal;
          
        }, 0)
    
        this.cd.detectChanges()
      })
  }

  deliveryaddress(k:any){
    if(k.invalid){
      console.log("areaw")
      this.validater=true
      
    }

    else{
      this.showaddress=false
      this.allpayments=true
    }
  }


  payme(a:any){
   this.paymentype=a
   
  }

  placeordercash(){
    alert("your order was confirmed")
    this.router.navigate(['/'])
  }

}
