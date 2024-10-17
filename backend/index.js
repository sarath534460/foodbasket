const bodyParser = require("body-parser")
let express=require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
var uri="mongodb+srv://sarath:mongodb@sarath.pwemxqm.mongodb.net/?retryWrites=true&w=majority";
let nodemon=require("nodemon")
let app=express()
let verifyToken=require('./jwtverifymiddleware')
let mongoose=require("mongoose")
let cors=require("cors")
require('dotenv').config();
app.use(cors('*'))
let multer=require("multer")
let fs=require("fs")
let jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms')
let otp
let mobile
let expirationTime

let catecollec
let prodcollec
let cartcollec
let usercollec
let orders

const client = new MongoClient(uri);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function mongo(){
  let dbs= await client.connect()
 console.log("Connected to MongoDB");
//hello workdkj
 database=client.db("fruitbasket")
 catecollec =database.collection('category')
 prodcollec=database.collection('products')
 cartcollec=database.collection('cart')
 usercollec=database.collection('users')
 orders=database.collection('orders')


}

mongo()

const ds=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,"uploads/")
  },
  filename:(req,file,cb)=>{

      cb(null,Date.now()+file.originalname)

  }
});

const upload =multer({
  storage:ds
});

app.post('/mobileverify',async(req,res)=>{
  console.log(req.body)
   otp=Math.floor(Math.random()*9999+1000)
   mobile=req.body.mobileno
   console.log(otp)
   expirationTime = Date.now() + 30 * 1000;
  //   const response = await fast2sms.sendMessage({
  //   authorization: process.env.fasttoauthorization,
  //   sender_id:'LKHMDS'  ,      // Your Fast2SMS API key
  //   message: `Your OTP code is ${otp}`, // OTP message content
  //   numbers: [Number(req.body.mobileno)]          // Recipient phone number as an array
  //  });
   console.log(otp)
   res.json({message:"otp sent succufully"})
   
})

app.post('/verifyotp',async(req,res)=>{
 console.log(req.body.otp,req.body)

  if (Date.now() > expirationTime) {
    otp=""
  return res.json({ message: 'OTP expired',flag:3 });
  }

  if(otp==req.body.otp){
   
     let y=await usercollec.findOne({mobile:mobile})
   
     if(y==null){
      await usercollec.insertOne({mobile:mobile})
     }
    let token=jwt.sign({mobile:mobile},process.env.secret, { expiresIn: '1000h' })
    res.json({token:token,flag:1})
  }
  else{
    res.json({message:"invalidotp",flag:0})
  }

})


app.get('/allcategories',async(req,res)=>{
  try{
  let d=await catecollec.find({type:"pcategory"}).toArray();
  res.status(200).json({result:d})
  }
  catch(e){
    
  }
})

app.post('/getallproductsbycategory',async(req,res)=>{
 try{
  let parentname=await catecollec.findOne({categoryname:req.body.categoryname})
  

  let subcat=await catecollec.find({parentcategoryid:parentname._id}).toArray()

  let allidsofsubcat=subcat.map((data)=>{
    return data._id
  })

 
  let allproducts=await prodcollec.find({categoryid:{$in:allidsofsubcat}}).toArray()
 res.status(200).json(allproducts)
 
 }
 catch(err){
  console.log(err)
 }

})

app.post('/allsubcategories',async(req,res)=>{
  try{
  let k=await catecollec.findOne({categoryname:req.body.categoryfruit})
  
   let d=await catecollec.find({parentcategoryid:k._id}).toArray() 
   
  res.status(200).json(d)
  }
  catch(err){

  }
})

app.get('/allsubcategoriesofchild',async(req,res)=>{
  let k=await catecollec.find({type:"ccategory"}).toArray()
  
  res.status(200).json(k)
})

app.post('/addcategoryfromadmin',async(req,res)=>{
 let resd= await catecollec.insertOne({categoryname:req.body.categoryname,parentcategoryid:
    null,type:"pcategory"})
    res.status(200).json({msg:"success"})
})

app.post('/addsubcategorytype',async(req,res)=>{
 
 let r= req.body.parentcategory

    let m=await catecollec.findOne({categoryname:r})

  

  let resd= await catecollec.insertOne({ parentcategoryid:m._id,categoryname:req.body.subcategory,type:"ccategory"})

  res.status(200).json({message:"success"})
   
 })


 app.post('/addproducts',upload.single('hjk'),async(req,res)=>{
   let y=JSON.parse(req.body.data)
   
   let m=await catecollec.findOne({categoryname:y.subcategory})

   let readfile=fs.readFileSync(req.file.path)
   let binary=Buffer.from(readfile)//making binary data from image
   let resd= await prodcollec.insertOne({ productname:y.name,price:y.price,productimage:binary,description:y.desc,stock:y.stock,categoryid:m._id,quantity:0})
   res.status(200).json({msg:"success"})
 })

 app.get('/getallcategorieswithproducts',async(req,res)=>{

  try {
    // Fetch parent categories
    let pcat = await catecollec.find({ type: "pcategory" }).toArray();

    let results = await Promise.all(pcat.map(async (data) => {
        let k = data._id;
        let categoryname=data.categoryname
        let subcat = await catecollec.find({ parentcategoryid: k }).toArray();
       
         let subids = subcat.map(item => item._id);
         let nsubids = new Set(subids)
         let arrsubcat=[...nsubids];
        let allproducts = await prodcollec.find({ categoryid: { $in: arrsubcat } }).toArray();
       //console.log(allproducts)
      return { category: k, categoryname:categoryname,subcategory: subcat,allproduct: allproducts};
    }));

    // Log the resolved results
   
    res.status(200).json(results);
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
   }

})

app.post('/addtocart',verifyToken,async(req,res)=>{
  try{
  req.body.quantity++
  delete req.body._id
  req.body.itemtotal=req.body.quantity*req.body.price
  req.body.mobile=req.user.mobile

 
  let u=await cartcollec.insertOne(req.body)
  

  res.status(200).json(u)
  }
  catch(err){
    console.log(err)
  }
})

app.get('/getcart',verifyToken,async(req,res)=>{
  try{
   
 let y= await cartcollec.find({mobile:req.user.mobile}).toArray()
  
 res.status(200).json(y)
 }
 catch(err){
   console.log(err)
    res.status(500).json({ message: "Internal Server Error" });

 }
})

app.put('/inccart',verifyToken,async(req,res)=>{
 
  
  req.body.quantity++
  req.body.itemtotal=req.body.quantity*req.body.price

  let y=await cartcollec.updateOne({mobile:req.user.mobile,productname:req.body.productname},{$set:{quantity:req.body.quantity,itemtotal:req.body.itemtotal}})
  res.status(200).json(y)
})

app.delete('/desccart/:productname/:quantity/:price',verifyToken,async(req,res)=>{
console.log(req.params.id)
console.log(req.params.quantity)
   req.params.quantity--
   let t=req.params.quantity*req.params.price

   if(req.params.quantity==0){
    let y=await cartcollec.deleteOne({mobile:req.user.mobile,productname:req.params.productname})
    res.status(200).json(y)

   }
   else{
   let y=await cartcollec.updateOne({mobile:req.user.mobile,productname:req.params.productname},{$set:{quantity:req.params.quantity,itemtotal:t}})
   res.status(200).json(y)
   }
})


app.post('/test',verifyToken,(req,res)=>{
  console.log(req.body.a)
  if(req.body.a>0){
    return res.json("hello")
  }
  
  if(req.body.a==67){
    return res.json("hi")
  }

})

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected monggse'))
.catch((err) => console.error('Could not connect to MongoDB', err));

const carSchema = new mongoose.Schema({  // create schema  means crete the blueprint for variables
  name: String,
  lastname: String,
  mobile: String,
});

let user=mongoose.model('users',carSchema) //model for user collec and schema placed inside the user collec

app.get('/mong',async(req,res)=>{
  
 let y=await new user({name:"sarath",lastname:"ch",mobile:"96662"}).save()
 res.json(y)
})

app.listen(78,()=>{console.log("listening on port 78")})



