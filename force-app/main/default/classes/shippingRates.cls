public with sharing class shippingRates {

    /**
     * Name: getFedexToken
     * Description: Get security Token
     * @param none
     * @return String  response (Token)
     * Author: John Guillen
     */
    @AuraEnabled
    public static String getFedexToken(){
        Http http = new Http();
        HttpRequest req = new HttpRequest();

        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setEndpoint( Test.isRunningTest() ? 'https://apis-sandbox.fedex.com/oauth/token' : Api_Setting__mdt.getInstance('fedex')?.Auth_Endpoint__c );

        String clientId_Str     = Test.isRunningTest() ? '123' : Api_Setting__mdt.getInstance('fedex')?.Client_Id__c;
        String clientSecret_Str = Test.isRunningTest() ? '456' : Api_Setting__mdt.getInstance('fedex')?.Client_Secret__c;
        System.debug('* * * getFedexToken  -  clientId_Str     => ' + clientId_Str);
        System.debug('* * * getFedexToken  -  clientSecret_Str => ' + clientSecret_Str);
        
        String requestBody    = 'grant_type=client_credentials&client_id=' + clientId_Str + '&client_secret=' + clientSecret_Str;

        req.setBody(requestBody);
        req.setTimeout(30000);
        HTTPResponse response = http.send(req);

        return response.getBody(); 
        
    }


    /**
     * Name: getFedexTgetFedexShippingRatesoken
     * Description: Get Fedex Shipping Rates
     * @param String    token       - Security Token
     * @param String    jsonString  - Json with origin and destination address, Account, weight
     * @return String   respondse   - Json with all quotes availables for the delivery
     * Author: John Guillen
     */
    @AuraEnabled
    public static String getFedexShippingRates(String token, String jsonString){
        String authHeader = 'Bearer ' + token;
        Http http = new Http();
        HttpRequest req = new HttpRequest();

        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('x-locale', 'en_US');
        req.setHeader('Authorization', (Test.isRunningTest() ? 'Bearer 123' : authHeader) );
        req.setEndpoint( Test.isRunningTest() ? 'https://apis-sandbox.fedex.com/rate/v1/rates/quotes' : Api_Setting__mdt.getInstance('fedex')?.Rates_Endpoint__c );

        req.setBody(jsonString);
        req.setTimeout(30000);
        HTTPResponse response = http.send(req);

        return response.getBody();
        
    }


}