import { LightningElement, api } from 'lwc';
import getTokenApi from '@salesforce/apex/shippingRates.getFedexToken';
import getShippingRates from '@salesforce/apex/shippingRates.getFedexShippingRates'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShippingRatesCmp extends LightningElement {
  
  _originZip = '34747';
  _originCountry = 'US';
  _destinationZip = '00000';
  _destinationCountry = 'PA';
  tokenId = '';
  requestJson = {};
  showResults = false;
  resultJson;

  // ----- Get Token API -----
  getTokenCall(){
    getTokenApi({})
    .then(result => {
        this.tokenId = JSON.parse(result).access_token;
    })
    .catch(error => {
        console.log(error)
    })
  }


  // ----- Initialize -----
  connectedCallback() {
      this.getTokenCall();
  }


  // ---- Handlers Logic -----
  handleOriginChange(event) {
    this._originZip = event.detail.postalCode;
    this._originCountry = event.detail.country;
    
    this.showResults = false;
  }

  handleDestinationChange(event) {
    this._destinationZip = event.detail.postalCode;
    this._destinationCountry = event.detail.country;
    
    this.showResults = false;
  }


  handleGetQoute(event){
    console.log("api call logic");
    if (this._originZip != "" && this._originCountry != "" && this._destinationZip != "" && this._destinationCountry  != "") {
      console.log("getquote true");
      this.requestJson = {
        "accountNumber": {"value": "510087640"},
        "requestedShipment": {
          "shipper":    {"address": { "postalCode": this._originZip,      "countryCode": this._originCountry}},
          "recipient":  {"address": { "postalCode": this._destinationZip, "countryCode": this._destinationCountry}},
          "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
          "rateRequestType": ["ACCOUNT"],
          "requestedPackageLineItems": [{"weight": {"units": "LB","value": 10}}]
        }
      }
      this.getQuoteApi();
    }else{
      console.log("getquote false");
      this.showToast('Something wrong', 'All the fields are required. Please, check both addresses ', 'warning', 'dismissible');
    }
  
  }

  getQuoteApi(){
    console.log("getQuoteApi");
    getShippingRates({token: this.tokenId, jsonString: JSON.stringify(this.requestJson)})
    .then(result => {
        console.log('result --> ', result); 
        this.resultJson = JSON.parse(result);
        
        if (this.resultJson.hasOwnProperty('errors')) {
          console.log('has error -> ', this.resultJson)
          this.showToast('Something wrong', this.resultJson.errors[0].message, 'error', 'dismissible');
        }else{
          console.log('result --> ', this.resultJson);
          this.showResults = true;
        }
    })
    .catch(error => {
        console.log('Error --> ',error);
        this.showToast('Something wrong', 'Please, try again later or contact customer support', 'error', 'dismissible'); 
    })
  }


  showToast(toastTitle, toastMsg, toastVariant, toastMode) {
    console.log('showToast')
    const evt = new ShowToastEvent({
      title: toastTitle
      ,message: toastMsg
      ,variant: toastVariant
      ,mode: toastMode
    });
    this.dispatchEvent(evt);  
  }


}