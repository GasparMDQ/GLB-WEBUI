$(function() {
  initApp();
  $('section').addClass('row');
  //Loads the phonebook into the element #phonebook-list, one contact per row
  loadPhoneBookOnBrowser();
});

function initApp() {
  retrievePhonebook();
  $('form').submit(function(e) {
    e.preventDefault();
    var contact = Object.create(null);
    contact.name = e.target.name_form.value;
    contact.address = e.target.address_form.value;
    contact.cellphone = e.target.cell_form.value;
    contact.phone = e.target.home_form.value;
    contact.email = e.target.email_form.value;
    addToPhonebook(contact, e.target.id_form.value);
    resetForm();
    loadPhoneBookOnBrowser();
    return false;
  });
}

function addToPhonebook(contact, id) {
  var phonebook = retrievePhonebook();
  if(id){
    phonebook.contacts.splice(id, 1);
    phonebook.contacts.push(contact);
  } else {
    phonebook.contacts.push(contact);
  }
  console.log(id);
  savePhonebook(phonebook);
}

function savePhonebook(phonebook) {
  localStorage.phonebook = JSON.stringify(phonebook);
}

function retrievePhonebook() {
  var phonebook = localStorage.phonebook;
  if (phonebook == null || phonebook == 'null') {
    phonebook = Object.create(null);
    phonebook.name = prompt('New phonebook owner:');
    phonebook.contacts = Array();
    savePhonebook(phonebook);
  }
  return JSON.parse(localStorage.phonebook);
}

function loadPhoneBookOnBrowser() {
  var pbook = retrievePhonebook(),
    length = pbook.contacts.length;

  //Container element: #phonebook-list
  $('#phonebook-list').empty();
  $('body header > h1').empty().append(pbook.name + '\'s Phonebook');
  for (var i = 0; i < length; i++) {
    var contact = pbook.contacts[i];
    $('#phonebook-list').append(function() {
      return '<div class="contact">' +
        '<header id="header_' + i + '">' +
        contact.name +
        '</header>' +
        '</div>';
    });
  }
  $('.contact').addClass('row').append(function() {
    addCRUD($(this));
  });
  $('.contact > header').click(function() {
    showDetails($(this));
  });
  $('.btn-edit').click(function() {
    preSetFormForEdit($(this));
  });
  $('.btn-remove').click(function() {
    deleteContact($(this));
  });
}

function addCRUD($element) {
  $element.append(function() {
    var $content = $('<div></div>').addClass('crud');
    $content.append(
      '<button type="button" id="edit-btn-'+
      $element.closest('.contact').find('header').attr('id').replace(/^\D+/g, '')+
      '" class="btn-edit" data-toggle="modal" data-target="#contact-modal">' +
      '<span>Edit</span></button>');
    $content.append(
      '<button type="button" class="btn-remove">' +
      '<span>Remove</span></button>');
    return $content;
  });
}

function preSetFormForEdit($element) {
  var pbook = retrievePhonebook(),
    id = $element.attr('id').replace(/^\D+/g, '');
  $form = $('#contact-form');
  $form.find('#id_form').attr('value', id);
  $form.find('#name_form').val(pbook.contacts[id].name);
  $form.find('#address_form').val(pbook.contacts[id].address);
  $form.find('#cell_form').val(pbook.contacts[id].cellphone);
  $form.find('#home_form').val(pbook.contacts[id].phone);
  $form.find('#email_form').val(pbook.contacts[id].email);
}

function resetForm() {
  $form = $('#contact-form');
  $form.find('#id_form, #name_form, #address_form, '+
    '#cell_form, #home_form, #email_form').removeAttr('value');
  $form.find('#id_form, #name_form, #address_form, '+
    '#cell_form, #home_form, #email_form').val('');
  $form.show();
}

function deleteContact($element) {
  var row = $element.closest('.contact'),
          
    //replace all non numeric char with 'blank'
    id = row.find('header').attr('id').replace(/^\D+/g, ''),
    pbook = retrievePhonebook();
  pbook.contacts.splice(id, 1);
  savePhonebook(pbook);
  loadPhoneBookOnBrowser();
}

function showDetails($element) {
  var id = $element.attr('id').replace(/^\D+/g, '');
  if (!$('#detail_' + id).length) {
    var pbook = retrievePhonebook(),
      contact = pbook.contacts[id];
    $element.after(function() {
      var $content = $('<div></div>').addClass('details').attr('id', 'detail_' + id);
      $content.append(contact.address + '<br/>');
      $content.append(contact.cellphone + '<br/>');
      $content.append(contact.phone + '<br/>');
      $content.append(contact.email + '<br/>');
      return $content;
    });
  } else {
    $('#detail_' + id).remove();
  }
}
