//===================== Checking the input value is Valid or Invalid =====================//
const valid = function (value) {
    if (
      typeof value == "number" ||
      typeof value == "undefined" ||
      typeof value == null
    ) {
      return false;
    }
    if (typeof value == "string" && value.trim().length == 0) {
      return false;
    }
    return true;
  };
  
  //===================== Checking the input value with Regex =====================//
  const regForName = function (value) {
    return /^[A-Za-z]+$\b/.test(value);
  };
  
  const regForFullName = function (value) {
    return /^[A-Z][a-z]{1,}(?: [A-Z][a-z]+){0,10}$/.test(value);
  };
  
  const regForLink = function (value) {
    return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
      value
    );
  };
  
  const regForExtension = function (value) {
    return /^https?:\/\/.\/.\.(png|gif|webp|jpeg|jpg)\??.*$/.test(value);
  };
  
  const regForEmail = function (value) {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value);
  };
  
  const regForMobileNo = function (value) {
    return /^((\+91)?|91)?[789][0-9]{9}$/.test(value);
  };

const regForPassword = function(value){
  return   /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(value)
};

  
  //===================== Module Export =====================//
  module.exports = {
    valid,
    regForName,
    regForFullName,
    regForPassword,
    regForLink,
    regForExtension,
    regForEmail,
    regForMobileNo,
  };