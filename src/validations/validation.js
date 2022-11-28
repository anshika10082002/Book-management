const mongoose= require("mongoose")
//===================== Checking the input value is Valid or Invalid =====================//


const isEmpty = function (value) {
    if (
      typeof value == "number" || typeof value == "undefined" || typeof value == null ) {
      return false;
    }
    if (typeof value == "string" && value.trim().length == 0) {
      return false;
    }
    return true;
  };
  
  //===================== NAME VALIDATION =====================//

  const isValidName = function (value) {
    return /^[A-Za-z]+$\b/.test(value);
  };
  
  //============================ EMAIL VALIDATION ==========================================//

  const isValidEmail = function (value) {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value);
  };
  

//============================= MOBILE VALIDATION ===========================================//

  const isValidMobileNo = function (value) {
    return /^((\+91)?|91)?[789][0-9]{9}$/.test(value);
  };


//===================================== PASSWORD VALIDATION ======================================//


const isValidPassword = function(value){
   return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/.test(value)
  
};

//===================================== objectId validation ===================================//

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
  
//======================================Date validation ========================================================//

function isDateValid(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if(typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
}
 
  module.exports = {isEmpty,isValidName,isValidEmail,isValidMobileNo,isValidPassword,isDateValid,isValidObjectId};






      
    //   const regForExtension = function (value) {
    //     return /^https?:\/\/.\/.\.(png|gif|webp|jpeg|jpg)\??.*$/.test(value);
    //   };


    //pass--//return   /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(value)