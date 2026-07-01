import mongoose from "mongoose";
export const connectDB = async ()=>{
  try{
    await mongoose.connect("mongodb+srv://khadizaaktertanjila:dyjYG2LRBtBm95mv@cluster0.pc1uas1.mongodb.net/mernStack?retryWrites=true&w=majority&appName=Cluster0");
  }catch(e){
    console.log(e)
  }
  
};



