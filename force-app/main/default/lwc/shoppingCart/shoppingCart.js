import { LightningElement, track } from 'lwc';

export default class ShoppingCart extends LightningElement {
    title = 'Shopping Cart';
    @track wishlistCount=1;
    @track cartCount=2;

    handleWishlistUpdate(event){
        this.wishlistCount = event.detail;
    }

    handleCartUpdate(event){
        this.cartCount = event.detail;
    }

}