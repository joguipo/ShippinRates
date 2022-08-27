@isTest
private class shippingRates_Test {

    @isTest
    static void test_GetFedexToken_ok(){
        System.debug('* * *  S T A R T I N G   -   test_GetFedexToken_ok');
        
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('TokenResponse');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        Test.setMock(HttpCalloutMock.class, mock);

        String result = '';
        Test.startTest();

            result = shippingRates.getFedexToken();
            
            // validate response
            System.debug('* * *  test_GetFedexToken_ok - resutl -> ' +  result);
            Map<String, Object> m = (Map<String, Object>) JSON.deserializeUntyped(result);
            System.debug('* * *  test_GetFedexToken_ok - token_type -> ' +  m.get('token_type') );
            System.assertEquals('bearer', m.get('token_type')); 
            
        Test.stopTest();

    }


    @isTest
    static void test_GetFedexShippingRates_ok(){
        System.debug('* * *  S T A R T I N G   -   test_GetFedexShippingRatesn_ok');
        
        StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
        mock.setStaticResource('ShippingRatesResponse');
        mock.setStatusCode(200);
        mock.setHeader('Content-Type', 'application/json');
        Test.setMock(HttpCalloutMock.class, mock);

        String jsonBody = '{"accountNumber":{"value":"510087640"},"requestedShipment":{"shipper":{"address":{"postalCode":65247,"countryCode":"US"}},"recipient":{"address":{"postalCode":75063,"countryCode":"US"}},"pickupType":"DROPOFF_AT_FEDEX_LOCATION","rateRequestType":["ACCOUNT","LIST"],"requestedPackageLineItems":[{"weight":{"units":"LB","value":10}}]}}';
        String token    = 'bearer 123';
        String result = '';

        Test.startTest();

            result = shippingRates.getFedexShippingRates(token, jsonBody);

            // validate response
            System.debug('* * *  test_GetFedexToken_ok - resutl -> ' +  result);
            System.assert(result!= null);
            
        Test.stopTest();

    }



}