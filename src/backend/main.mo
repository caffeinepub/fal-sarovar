import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    mobile : ?Text;
    address : ?Text;
  };

  // Data Structures
  public type Category = {
    id : Nat;
    name : Text;
    description : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    categoryId : Nat;
    price : Float;
    description : Text;
    healthBenefits : Text;
    image : Text;
    inStock : Bool;
  };

  public type PromoCode = {
    id : Nat;
    code : Text;
    discountType : {
      #flat : Float;
      #percentage : Float;
    };
    minOrderValue : Float;
    expiryDate : ?Time.Time;
    isActive : Bool;
  };

  public type Customer = {
    id : Nat;
    name : Text;
    mobile : Text;
    address : Text;
  };

  public type OrderStatus = {
    #pending;
    #accepted;
    #completed;
  };

  public type Order = {
    id : Nat;
    customerId : Nat;
    products : [OrderProduct];
    totalAmount : Float;
    discountedAmount : ?Float;
    promoCodeId : ?Nat;
    orderDate : Time.Time;
    status : OrderStatus;
    isNew : Bool;
    paymentMethod : ?Text; // Placeholder for future payment integration
    paymentStatus : ?Text; // Placeholder for future payment integration
    transactionReference : ?Text; // Placeholder for future payment integration
  };

  public type OrderProduct = {
    productId : Nat;
    quantity : Nat;
  };

  module CategoryCompare {
    public func compare(category1 : Category, category2 : Category) : Order.Order {
      switch (Text.compare(category1.name, category2.name)) {
        case (#equal) { Nat.compare(category1.id, category2.id) };
        case (order) { order };
      };
    };
  };

  module ProductCompare {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      switch (Text.compare(product1.name, product2.name)) {
        case (#equal) { Nat.compare(product1.id, product2.id) };
        case (order) { order };
      };
    };
  };

  module PromoCodeCompare {
    public func compare(pc1 : PromoCode, pc2 : PromoCode) : Order.Order {
      switch (Text.compare(pc1.code, pc2.code)) {
        case (#equal) { Nat.compare(pc1.id, pc2.id) };
        case (order) { order };
      };
    };
  };

  module OrderCompare {
    public func compareByDate(o1 : Order, o2 : Order) : Order.Order {
      Int.compare(o2.orderDate, o1.orderDate);
    };
  };

  // Persistent State using Core Collections
  let userProfiles = Map.empty<Principal, UserProfile>();
  let categories = Map.empty<Nat, Category>();
  let products = Map.empty<Nat, Product>();
  let promoCodes = Map.empty<Nat, PromoCode>();
  let customers = Map.empty<Nat, Customer>();
  let orders = Map.empty<Nat, Order>();
  let customerByMobile = Map.empty<Text, Nat>();

  var nextCategoryId = 1;
  var nextProductId = 1;
  var nextPromoCodeId = 1;
  var nextCustomerId = 1;
  var nextOrderId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Allow authenticated users (both #user and #admin) to access their profiles
    // Guests (#guest) are not allowed
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) {
        Runtime.trap("Unauthorized: Only authenticated users can access profiles");
      };
      case (#user or #admin) {
        userProfiles.get(caller);
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Allow authenticated users (both #user and #admin) to save their profiles
    // Guests (#guest) are not allowed
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#guest) {
        Runtime.trap("Unauthorized: Only authenticated users can save profiles");
      };
      case (#user or #admin) {
        userProfiles.add(caller, profile);
      };
    };
  };

  // Category Management
  public shared ({ caller }) func createCategory(name : Text, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextCategoryId;
    nextCategoryId += 1;

    let category : Category = {
      id;
      name;
      description;
    };

    categories.add(id, category);
    id;
  };

  public shared ({ caller }) func updateCategory(id : Nat, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let category : Category = {
      id;
      name;
      description;
    };

    categories.add(id, category);
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    categories.remove(id);
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    // Public access - anyone can view categories
    categories.values().toArray().sort();
  };

  // Product Management
  public shared ({ caller }) func createProduct(
    name : Text,
    categoryId : Nat,
    price : Float,
    description : Text,
    healthBenefits : Text,
    image : Text,
    inStock : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id;
      name;
      categoryId;
      price;
      description;
      healthBenefits;
      image;
      inStock;
    };

    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(
    id : Nat,
    name : Text,
    categoryId : Nat,
    price : Float,
    description : Text,
    healthBenefits : Text,
    image : Text,
    inStock : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let product : Product = {
      id;
      name;
      categoryId;
      price;
      description;
      healthBenefits;
      image;
      inStock;
    };

    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProductsByCategory(categoryId : Nat) : async [Product] {
    // Public access - anyone can view products
    products.values().toArray().filter(func(p) { p.categoryId == categoryId });
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    // Public access - anyone can view product details
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    // Public access - anyone can view products
    products.values().toArray().sort();
  };

  // Promo Code Management
  public shared ({ caller }) func createPromoCode(
    code : Text,
    discountType : {
      #flat : Float;
      #percentage : Float;
    },
    minOrderValue : Float,
    expiryDate : ?Time.Time,
    isActive : Bool,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextPromoCodeId;
    nextPromoCodeId += 1;

    let promoCode : PromoCode = {
      id;
      code;
      discountType;
      minOrderValue;
      expiryDate;
      isActive;
    };

    promoCodes.add(id, promoCode);
    id;
  };

  public shared ({ caller }) func updatePromoCode(
    id : Nat,
    code : Text,
    discountType : {
      #flat : Float;
      #percentage : Float;
    },
    minOrderValue : Float,
    expiryDate : ?Time.Time,
    isActive : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let promoCode : PromoCode = {
      id;
      code;
      discountType;
      minOrderValue;
      expiryDate;
      isActive;
    };

    promoCodes.add(id, promoCode);
  };

  public shared ({ caller }) func deletePromoCode(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    promoCodes.remove(id);
  };

  public query ({ caller }) func getAllPromoCodes() : async [PromoCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view promo codes");
    };
    promoCodes.values().toArray().sort();
  };

  public query ({ caller }) func validatePromoCode(code : Text, orderAmount : Float) : async ?PromoCode {
    // Public access - customers need to validate promo codes during checkout
    let promoOpt = promoCodes.values().toArray().find(func(p) { p.code == code });
    switch (promoOpt) {
      case (null) { null };
      case (?promo) {
        if (not promo.isActive) { return null };
        if (orderAmount < promo.minOrderValue) { return null };
        switch (promo.expiryDate) {
          case (null) { ?promo };
          case (?expiry) {
            if (Time.now() > expiry) { null } else { ?promo };
          };
        };
      };
    };
  };

  // Customer Management
  public shared ({ caller }) func createCustomer(name : Text, mobile : Text, address : Text) : async Nat {
    // Public access - guests can create customer records during checkout
    let id = nextCustomerId;
    nextCustomerId += 1;

    let customer : Customer = {
      id;
      name;
      mobile;
      address;
    };

    customers.add(id, customer);
    customerByMobile.add(mobile, id);
    id;
  };

  public query ({ caller }) func getCustomer(id : Nat) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view customer details");
    };
    customers.get(id);
  };

  public query ({ caller }) func getCustomerByMobile(mobile : Text) : async ?Customer {
    // Public access - needed for order history lookup by phone
    switch (customerByMobile.get(mobile)) {
      case (null) { null };
      case (?customerId) { customers.get(customerId) };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder(
    customerId : Nat,
    products : [OrderProduct],
    totalAmount : Float,
    promoCodeId : ?Nat,
  ) : async Nat {
    // Public access - guests and users can place orders
    let discountedAmount = switch (promoCodeId) {
      case (null) { null };
      case (?pcId) {
        switch (promoCodes.get(pcId)) {
          case (null) { null };
          case (?promo) {
            if (not promo.isActive) { null } else {
              switch (promo.discountType) {
                case (#flat(v)) { ?(totalAmount - v) };
                case (#percentage(p)) { ?(totalAmount * (1.0 - p / 100.0)) };
              };
            };
          };
        };
      };
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      customerId;
      products;
      totalAmount;
      discountedAmount;
      promoCodeId;
      orderDate = Time.now();
      status = #pending;
      isNew = true;
      paymentMethod = null;
      paymentStatus = null;
      transactionReference = null;
    };

    orders.add(orderId, order);
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : Order = {
          order with status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func markOrderAsSeen(orderId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder : Order = {
          order with isNew = false;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort(OrderCompare.compareByDate);
  };

  public query ({ caller }) func getOrdersByCustomer(customerId : Nat) : async [Order] {
    // Public access - customers can view their own order history by phone lookup
    orders.values().toArray().filter(func(order) { order.customerId == customerId }).sort(OrderCompare.compareByDate);
  };

  public query ({ caller }) func getNewOrderCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view new order count");
    };
    orders.values().toArray().filter(func(order) { order.isNew }).size();
  };
};
