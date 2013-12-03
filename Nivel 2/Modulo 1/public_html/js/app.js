"use strict";

require.config({
  paths: {
    'underscore': 'lib/underscore-min',
    'jquery': 'lib/jquery-1.10.2.min',
    'backbone': "lib/backbone-min",
    'localstorage': "lib/backbone.localStorage-min"        
  },  
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

require(['jquery', 'underscore', 'backbone', 'localstorage'], function($, _, Backbone){
  
  var Contact = Backbone.Model.extend({
    defaults: function () {
      return {
        id: '',
        name: '',
        address: '',
        cellphone: '',
        phone: '',
        email: ''
      };
    },
    validate: function(attrs) {
      if ( _.isEmpty(attrs.name) ) {
        return "Missing Name";
      }
    }
  });

  var Phonebook = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("PhoneBook"),
    model: Contact
  });
  
  var PhoneBookView = Backbone.View.extend({
    el: $('body'),
    template: _.template($('#contact-list').html()),
    model: Contact,
    events: {
      'click .btn-add': 'guardar',
      'click .btn-edit': 'editar',
      'click .btn-remove': 'borrar',
      'click .btn-reset': 'resetForm',
      'click h4': 'showDetails'
    },

    initialize: function () {
      _.bindAll(this, "render", "guardar", "editar", "borrar");
      this.render();
    },
    
    showDetails: function (ev) {
      $('#contact-detail-id').attr('value', $(ev.currentTarget).attr('value'));
      var DetailView = new PhoneBookDetailView();
      DetailView.render();
    },
    
    render: function () {
      //Reset the contact form
      this.resetForm();
      PhoneBook.fetch();
      PhoneBook.comparator = "name";
      PhoneBook.sort();
      $('#phonebook-list > ul').html(this.template({
        contacts: PhoneBook.toJSON()
      }));
      return this;
    },
    
    resetForm: function () {
      $('#contact-form').find('#id_form, #name_form, #address_form, '+
        '#cell_form, #home_form, #email_form').removeAttr('value').val('').show();
      $('.btn-add').val('0');
      $(".btn-add > span").html('Add');
      $(".btn-reset > span").html('Reset');
    },
    
    editar: function (ev) {
      PhoneBook.fetch();
      var cContact = PhoneBook.get($(ev.currentTarget).val());

      $("#name_form").val(cContact.get('name')).focus();
      $("#address_form").val(cContact.get('address'));
      $("#cell_form").val(cContact.get('cellphone'));
      $("#home_form").val(cContact.get('phone'));
      $("#email_form").val(cContact.get('email'));

      $(".btn-add").val($(ev.currentTarget).val());

      $(".btn-add > span").html('Save');
      $(".btn-reset > span").html('Cancel');
    },
    
    borrar: function (ev) {
      var cId = $('#contact-detail-id').val();
      var cContact = PhoneBook.get($(ev.currentTarget).val());
      if (parseInt(cId) === cContact.id) {
        $('#contact-detail-id').attr('value', "0");
        $('#phonebook-details').empty();
      }
      cContact.destroy();
      this.render();
    },
    
    guardar: function (ev) {
      var nName = $("#name_form").val();
      var nAddress = $("#address_form").val();
      var nCellphone = $("#cell_form").val();
      var nPhone = $("#home_form").val();
      var nEmail = $("#email_form").val();

      if ($(ev.currentTarget).val()=== '0') {
        
        PhoneBook.comparator = "id";
        PhoneBook.sort();
        
        var nId = (!PhoneBook.length) ? 1 : PhoneBook.last().get('id') + 1;
        var nContact = new Contact({
          id: nId,
          name: nName,
          address: nAddress,
          cellphone: nCellphone,
          phone: nPhone,
          email: nEmail
        });
        PhoneBook.add(nContact);
        nContact.save();
      } else {
        var eContact = PhoneBook.get($('.btn-add').val());
        eContact.set('name', nName);
        eContact.set('address', nAddress);
        eContact.set('cellphone', nCellphone);
        eContact.set('phone', nPhone);
        eContact.set('email', nEmail);
        eContact.save();
      }
      this.render();
    }
  });
  
  var PhoneBookDetailView = Backbone.View.extend({
    el: $('#phonebook-details'),
    template: _.template($('#contact-details').html()),
    model: Contact,

    initialize: function () {
      _.bindAll(this, "render");
    },
    
    render: function () {
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
    }
    
  });
  
  var PhoneBook = new Phonebook();
  var App = new PhoneBookView();  

});
