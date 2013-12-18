'use strict';

require.config({
  paths: {
    'underscore': 'lib/underscore-min',
    'jquery': 'lib/jquery-1.10.2.min',
    'backbone': 'lib/backbone-min',
    'localstorage': 'lib/backbone.localStorage-min',
    'jquery.bootstrap': 'lib/bootstrap.min',
    'jquery.foundation': 'lib/foundation.min'
  },  
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'jquery.bootstrap': {
        deps: ['jquery']
    },
    'jquery.foundation': {
        deps: ['jquery']
    }
  }
});

require(['jquery', 'underscore', 'backbone', 'localstorage', 'jquery.foundation'], function($, _, Backbone){
  
  var Product = Backbone.Model.extend({
    defaults: function () {
      return {
        id: '',
        name: '',
        precio: '',
        descripcion: '',
        image: ''
      };
    }
  });
  
  var Warehouse = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('warehouse'),
    model: Product
  });
  
  var Item = Backbone.Model.extend({
    defaults: function(){
      return {
        id: '',
        product_id: '',
        cantidad: ''
      };
    }
  });
  
  var Lineadecaja = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('lineadecaja'),
    model: Item
  });

  
  var WareHouseView = Backbone.View.extend({
    el: $('#products-list'),
    template: _.template($('#products-list-tmpl').html()),
    model: Product,
    events: {
      'click .btn-details': 'showDetails'
    },
    
    initialize: function () {
      _.bindAll(this, 'render', 'showDetails');
      this.render();
    },

    render: function () {
      WareHouse.fetch();
      WareHouse.comparator = 'name';
      WareHouse.sort();
      this.$el.html(this.template({
        products: WareHouse.toJSON()
      }));
      return this;
    },

    showDetails: function (ev) {
      var id = $(ev.target).closest('button').val();
      new ProductDetailView({ product: WareHouse.get(id) });
    }
    
  });
  
  var NewProductView = Backbone.View.extend({
    el: $('#products-top'),
    template: _.template($('#products-new-tmpl').html()),
    model: Product,
    events: {
      'click .btn-add': 'guardar'
    },
    
    initialize: function () {
      _.bindAll(this, 'render', 'guardar');
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },

    guardar: function (ev) {
      var nName = $('#name_form').val();
      var nPrice = $('#price_form').val();
      var nDescription = $('#desc_form').val();
      var nImage = $('#image_form').val();

      if(nName == '' || nPrice == '' || nDescription == '' || nImage == ''){
      } else {
        WareHouse.comparator = "id";
        WareHouse.sort();

        var nId = (!WareHouse.length) ? 1 : WareHouse.last().get('id') + 1;
        var nProduct = new Product({
          id: nId,
          name: nName,
          precio: nPrice,
          descripcion: nDescription,
          image: nImage
        });
        WareHouse.add(nProduct);
        nProduct.save();
        this.render();
      }
    }
    
  });
  
  var ProductDetailView = Backbone.View.extend({
    el: $('#shopping-cart-sidebar'),
    template: _.template($('#products-details-tmpl').html()),
    model: Product,

    initialize: function (options) {
      this.options = options || {};
      _.bindAll(this, 'render');
      this.render();
    },
    
    render: function () {
      this.$el.html(this.template({ product: this.options.product.toJSON() }));
      return this;
    }
  });
  
  var ProductSlideView = Backbone.View.extend({
    el: $('#products-top'),
    template: _.template($('#products-slide-tmpl').html()),
    model: Product,

    initialize: function (options) {
      this.options = options || {};
      _.bindAll(this, 'render');
      this.render();
    },
    
    render: function () {
      this.$el.html(this.template({ products: WareHouse.toJSON() }));
      this.$el.foundation({
        orbit: {
          animation: 'slide',
          timer_speed: 4000,
          pause_on_hover: true,
          animation_speed: 500,
          navigation_arrows: true,
          bullets: true,
          next_on_click: true
        }
      });
      $(window).triggerHandler('resize'); //Hack para que calcule bien el alto del slide
      return this;
    }
  });
  
  var NavBarView = Backbone.View.extend({
    el: $('#navbar'),
    template: _.template($('#navigation-tmpl').html()),

    initialize: function (options) {
      _.bindAll(this, 'render');
      this.render();
    },
    
    render: function () {
      this.$el.html(this.template({ cartItems: LineaDeCaja.length }));
      this.$el.foundation();
      return this;
    }
  });
  //Inicializo colecciones
  var WareHouse = new Warehouse();
  var LineaDeCaja = new Lineadecaja();

  //Cargo en memoria los items
  WareHouse.fetch();
  WareHouse.comparator = 'name';
  WareHouse.sort();

  
  //Armado de rutas
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'homeview',
      'list': 'warehouseview',
      'checkout': 'checkout',
      'newProduct': 'newP'
    },
    
    homeview: function(){
      $('#products-list').empty();
      $('#shopping-cart-sidebar').empty();
      new NavBarView();
      new ProductSlideView();
    },
    warehouseview: function(){
      $('#products-top').empty();
      new NavBarView();
      new WareHouseView();
    },
    checkout: function(){
      //new CheckOutView();
    },
    newP: function(){
      $('#products-list').empty();
      $('#shopping-cart-sidebar').empty();
      new NavBarView();
      new NewProductView();
    }
  });
  
  //Inicializo router e historico y la app
  var router = new AppRouter();
  Backbone.history.start();

});
