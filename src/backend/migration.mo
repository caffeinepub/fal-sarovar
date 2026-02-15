import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type OldCategory = {
    id : Nat;
    name : Text;
    description : Text;
  };

  type OldProduct = {
    id : Nat;
    name : Text;
    categoryId : Nat;
    price : Float;
    description : Text;
    healthBenefits : Text;
    image : Text;
    inStock : Bool;
  };

  type OldOrderProduct = {
    productId : Nat;
    quantity : Nat;
  };

  type OldOrder = {
    id : Nat;
    customerId : Nat;
    products : [OldOrderProduct];
    totalAmount : Float;
    discountedAmount : ?Float;
    promoCodeId : ?Nat;
    orderDate : Time.Time;
    status : {
      #pending;
      #accepted;
      #completed;
    };
    isNew : Bool;
    paymentMethod : ?Text;
    paymentStatus : ?Text;
    transactionReference : ?Text;
  };

  type OldActor = {
    categories : Map.Map<Nat, OldCategory>;
    products : Map.Map<Nat, OldProduct>;
    orders : Map.Map<Nat, OldOrder>;
  };

  public func run(old : OldActor) : {
    categories : Map.Map<Nat, {
      id : Nat;
      name : Text;
      description : Text;
      image : ?Storage.ExternalBlob;
    }>;
    products : Map.Map<Nat, {
      id : Nat;
      name : Text;
      categoryId : Nat;
      description : Text;
      healthBenefits : Text;
      images : [Storage.ExternalBlob];
      inStock : Bool;
    }>;
    variants : Map.Map<Nat, {
      id : Nat;
      productId : Nat;
      name : Text;
      price : Float;
      isActive : Bool;
      inStock : Bool;
    }>;
    orders : Map.Map<Nat, {
      id : Nat;
      customerId : Nat;
      products : [{
        productId : Nat;
        variantId : Nat;
        quantity : Nat;
        price : Float;
      }];
      totalAmount : Float;
      discountedAmount : ?Float;
      promoCodeId : ?Nat;
      orderDate : Time.Time;
      status : {
        #pending;
        #accepted;
        #completed;
      };
      isNew : Bool;
      paymentMethod : ?Text;
      paymentStatus : ?Text;
      transactionReference : ?Text;
    }>;
  } {
    let newCategories = old.categories.map<Nat, OldCategory, { id : Nat; name : Text; description : Text; image : ?Storage.ExternalBlob }>(
      func(_id, oldCat) {
        { oldCat with image = null };
      }
    );

    let newProducts = old.products.map<Nat, OldProduct, { id : Nat; name : Text; categoryId : Nat; description : Text; healthBenefits : Text; images : [Storage.ExternalBlob]; inStock : Bool }>(
      func(_id, oldProd) {
        {
          id = oldProd.id;
          name = oldProd.name;
          categoryId = oldProd.categoryId;
          description = oldProd.description;
          healthBenefits = oldProd.healthBenefits;
          images = [];
          inStock = oldProd.inStock;
        };
      }
    );

    let emptyVariants = Map.empty<Nat, { id : Nat; productId : Nat; name : Text; price : Float; isActive : Bool; inStock : Bool }>();

    let newOrders = old.orders.map<Nat, OldOrder, {
      id : Nat;
      customerId : Nat;
      products : [{
        productId : Nat;
        variantId : Nat;
        quantity : Nat;
        price : Float;
      }];
      totalAmount : Float;
      discountedAmount : ?Float;
      promoCodeId : ?Nat;
      orderDate : Time.Time;
      status : {
        #pending;
        #accepted;
        #completed;
      };
      isNew : Bool;
      paymentMethod : ?Text;
      paymentStatus : ?Text;
      transactionReference : ?Text;
    }>(
      func(_id, oldOrder) {
        {
          oldOrder with products = oldOrder.products.map(
            func(oldProd) {
              {
                productId = oldProd.productId;
                variantId = 0;
                quantity = oldProd.quantity;
                price = 0.0;
              };
            }
          )
        };
      }
    );

    {
      categories = newCategories;
      products = newProducts;
      variants = emptyVariants;
      orders = newOrders;
    };
  };
};
