import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Service Name',        fieldName: 'serviceName' },
    { label: 'Total Base Charge',   fieldName: 'totalBaseCharge',   type: 'currency' },
    { label: 'Total Surcharges',    fieldName: 'totalSurcharges',   type: 'currency' },
    { label: 'Total Discounts',     fieldName: 'totalDiscounts',    type: 'currency' },
    { label: 'Total Net Charge',    fieldName: 'totalNetCharge',    type: 'currency' },
];

export default class ShippingRatesResults extends LightningElement {

    @api shippingRatesResults;
    rates = [];
    columns = columns;


    connectedCallback() {
        this.formatQuotes();
    } 

    formatQuotes(){
        let data = JSON.parse(JSON.stringify(this.shippingRatesResults.output.rateReplyDetails));
        let index = 0
        let dataLength = data.length;
        let tempData = {};

        for (; index < dataLength; index++) { 
            tempData = {};
            tempData.id             = index + 1;
            tempData.serviceName    = data[index].serviceName;
            tempData.totalBaseCharge= data[index].ratedShipmentDetails[0].totalBaseCharge;
            tempData.totalSurcharges= data[index].ratedShipmentDetails[0].shipmentRateDetail.totalSurcharges;
            tempData.totalDiscounts = data[index].ratedShipmentDetails[0].totalDiscounts;
            tempData.totalNetCharge = data[index].ratedShipmentDetails[0].totalNetCharge;

            this.rates.push(tempData);
        }
    }

}