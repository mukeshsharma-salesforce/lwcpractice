public class ProductController {
    public ProductController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getAllProducts(){
        return (List<Product2>)[SELECT Id, 
                    Name, 
                    Price__c, 
                    Brand__c, 
                    Brand__r.Name, 
                    Shipping_Option__c, 
                    Shipping_Option__r.Name
                FROM Product2];
    }
}
