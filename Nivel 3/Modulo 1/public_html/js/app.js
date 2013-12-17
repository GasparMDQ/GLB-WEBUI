"use strict";

require.config({
  paths: {
    'underscore': 'lib/underscore-min',
    'jquery': 'lib/jquery-1.10.2.min',
    'backbone': 'lib/backbone-min',
    'localstorage': 'lib/backbone.localStorage-min',
    'jquery.bootstrap': 'lib/bootstrap.min'
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
    }
  }
});

require(['jquery', 'underscore', 'backbone', 'localstorage', 'jquery.bootstrap'], function($, _, Backbone){
  
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
    template: _.template($('#products-base-tmpl').html()),
    initialize: function () {
      _.bindAll(this, 'render');
      this.render();
    },

    render: function () {
      this.$el.html(this.template({}));
      new WareHouseListView({ el: this.$('ul') });
      return this;
    }
    
  });
  
  var WareHouseListView = Backbone.View.extend({
    el: $('body'),
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
      WareHouse.comparator = "name";
      WareHouse.sort();
      $('#products-list > ul').html(this.template({
        products: WareHouse.toJSON()
      }));
      return this;
    },

    showDetails: function (ev) {
      console.log('ShowDetails');
      /**
      $('#contact-detail-id').attr('value', $(ev.currentTarget).attr('value'));
      var DetailView = new PhoneBookDetailView();
      DetailView.render();
      */
    },
    
  });
  
  var NewProductView = Backbone.View.extend({
    el: $('#products-list'),
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
      console.log('Saving!');
      
      
      var nName = $("#name_form").val();
      var nPrice = $("#price_form").val();
      var nDescription = $("#desc_form").val();
      var nImage = $("#image_form").val();

      if(nName == '' || nPrice == '' || nDescription == '' || nImage == ''){
        alert('Campos incompletos!');
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
  
  var PhoneBookDetailView = Backbone.View.extend({
    el: $('#products-details'),
    template: _.template($('#products-details-tmpl').html()),
    model: Product,

    initialize: function () {
      _.bindAll(this, "render");
    },
    
    render: function () {
      /*
      var cId = $('#contact-detail-id').val();
      if (cId !== '0') {
        var eContact = PhoneBook.get(cId);
        this.$el.html(this.template({
          contact: eContact.toJSON()
        }));
      } else {
        this.$el.empty();
      }
      return this;
    */
    }
  });
  
  var WareHouse = new Warehouse();
  var LineaDeCaja = new Lineadecaja();
  //var App = new WareHouseView();
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'warehouseview',
      'list': 'warehouseview',
      'checkout': 'checkout',
      'newProduct': 'newP'
    },
    
    warehouseview: function(){
      new WareHouseView();
    },
    checkout: function(){
      //new CheckOutView();
    },
    newP: function(){
      new NewProductView();
    }
  });
  
  var router = new AppRouter();
  Backbone.history.start();

});
