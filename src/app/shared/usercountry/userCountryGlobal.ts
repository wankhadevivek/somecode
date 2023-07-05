function rupees(){
     var sym = localStorage.getItem("country_currency");
      if(typeof sym === 'object'){
        return "₹";
      }else if(typeof sym === 'string'){
        return IsJsonString(sym) ? JSON.parse(sym): sym;
      }else{
        return sym;
      }
}
function IsJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

export var currency_symbol= rupees(); 