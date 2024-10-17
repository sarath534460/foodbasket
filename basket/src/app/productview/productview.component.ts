import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-productview',
  templateUrl: './productview.component.html',
  styleUrl: './productview.component.css'
})
export class ProductviewComponent {
  product: any
  a:any;
  http: HttpClient;
  cartservice: CartService;
  cd: ChangeDetectorRef;
  constructor(private route: ActivatedRoute,http:HttpClient,cartservice:CartService,cd:ChangeDetectorRef) {
    this.cartservice=cartservice
    this.route=route
    this.http=http
    this.cd=cd
  }

  ngOnInit(): void {
    // Subscribe to queryParams to get the data
    this.route.queryParams.subscribe(y => {
      if (y['data']) {
        this.product = JSON.parse(y['data']);
      }
    });
  }


  loaditems() {
    this.cartservice.getcartitems().subscribe(i => {
          
           this.product.quantity = 0; // Initialize quantity
          let m = i.find((k: any) =>k.productname == this.product.productname);

         
          if (m) {
           this. product.quantity = m.quantity; // Set the quantity from the cart
            
          }
         
      console.log(i);
      this.cd.detectChanges(); 
    });
  }

  addtocart(y:any){
    console.log(y)
    let d=this.cartservice.addtocart(y).subscribe(k=>{
      this.loaditems()
      this.cartservice.callcartlength()
      this.cd.detectChanges(); // Manually trigger change detection to update UI

    })
   
  }


  inccart(h:any){
    this.cartservice.inccart(h).subscribe((i:any)=>{
      this.loaditems()
     
      this.cd.detectChanges(); // Manually trigger change detection to update UI
     


    })
  }

  desccart(k:any){
    
   this.cartservice.desccart(k).subscribe((u:any)=>{

    this.loaditems()
    this.cartservice.callcartlength()

    this.cd.detectChanges();
   })
  }
   
}
