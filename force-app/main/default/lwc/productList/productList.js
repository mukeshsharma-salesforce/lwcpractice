import getAllProducts from '@salesforce/apex/ProductController.getAllProducts';
import { api, LightningElement, wire } from 'lwc';
import ID_FIELD from '@salesforce/schema/Product2.Id';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import BRAND_FIELD from '@salesforce/schema/Product2.Brand__r.Name';
import SHIP_FIELD from '@salesforce/schema/Product2.Shipping_Option__r.Name';

export default class ProductList extends LightningElement {

    //expecting array of brand ids or empty array
    _brandFilter = new Set();
    @api
    get brandFilter() {
        return this._brandFilter;
    }
    set brandFilter(value) {
        this._brandFilter = new Set(value || []);
        this.refreshFilters();
    }

    //expecting array of shipping option ids or empty array
    _shippingFilter = new Set();
    get shippingFilter() {
        this._shippingFilter;
        this.refreshFilters();
    }
    set shippingFilter(value) {
        this._shippingFilter = new Set(value || [])
        this.refreshFilters();
    }

    //expecting range in below object format
    _priceRange = {low: 0, high: undefined, max: undefined};
    @api
    get priceRange() {
        return this._priceRange;
    }
    set priceRange(value) {
        this.priceRange = value;
        this.refreshFilters();
    }
    

    columns = [
        {label: 'Id', fieldName: ID_FIELD.fieldApiName, type: 'id'},
        {label : 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text'},
        {label: 'Brand', fieldName: BRAND_FIELD.fieldApiName, type: 'text'},
        {label: 'Shipping Option', fieldName: SHIP_FIELD.fieldApiName, type: 'text'},
        {label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency'},
        {
            type: "button",
            iconName: "utility:cart",
            typeAttributes: {
              iconName: "utility:cart", 
              label: "Add to Cart",
              name: "Cart",
              title: "Cart",
              disabled: false,
              value: "cart",
              iconPosition: "left"
            },
            iconPosition: "center"
          },
          {
            type: "button",
            iconName: "custom:custom1",
            typeAttributes: {
              iconName: "custom:custom1",
              label: "Wishlist",
              name: "Wishlist",
              title: "Wishlist",
              disabled: false,
              value: "wishlist",
              iconPosition: "left"
            },
            iconPosition: "center"
          }
        ];
    displayProducts = [];
    _products = [];
    @wire(getAllProducts)
    wiredProducts({data,error}) {
        if(data) {
            this._products = data.map( (elem) => {
                return {
                    ...elem,
                    'Brand__r.Name' : elem?.Brand__r?.Name || '',
                    'Shipping_Option__r.Name' : elem?.Shipping_Option__r?.Name || '',
                }
            })
            console.log(this._products);
            console.log(BRAND_FIELD.fieldApiName);
            console.log(PRICE_FIELD);
            this.displayProducts = this._products;
            console.log('data',data);
        }else if(error){
            console.log(error)
        }
    }

    handleRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        let customEvent;
        switch(actionName) {
            case 'Cart': 
                customEvent = new CustomEvent('cartupdate', {
                    detail: recId,
                });
                break;
            case 'Wishlist':
                customEvent = new CustomEvent('wishlistupdate', {
                    detail: recId,
                });
                break;
        }

        if(customEvent) {
            this.dispatchEvent(customEvent);
        }
    }

    refreshFilters() {
        const filteredProducts = this._products;

        //Filter by Brand
        if(this._brandFilter.size > 0 ) {
            filteredProducts = filteredProducts.filter( prod => this._brandFilter.has(prod.Brand__c));
        }

        //Filter by Shipping 
        if(this._brandFilter.size > 0 ) {
            filteredProducts = filteredProducts.filter( prod => this._shippingFilter.has(prod.Shipping_Option__c));
        }

        //Filter by Range
        filteredProducts = filteredProducts.filter(prod => {
            let addProd = true;
            if( this.priceRange.high &&
                !prod.Price__c &&
                (this.priceRange.high != this.priceRange.max) && 
                (prod.Price__c > this.priceRange.high)) {
                    addProd = false;
            }

            if((prod.Price__c || 0 ) < (this.priceRange.low || 0)) {
                addProd = false;
            } 

            return addProd;
        })

        this.displayProducts = filteredProducts;
    }

}