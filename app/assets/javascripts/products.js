var ProductsApp = new Backbone.Marionette.Application();

var Product = Backbone.Model.extend({
  validate: function(attrs, options) {
    console.log('validate called');
    console.log(attrs);
    if (attrs.name === undefined || attrs.name == '')
      return { field: 'name', message: 'Name cannot be blank' };
    if (attrs.price === undefined || attrs.price == '' || attrs.price < 0)
      return { field: 'price', message: 'Price must be a non-negative number' };
  },

  initialize: function() {
    this.on('invalid', function(model, error) {
      $('.inline-errors').remove();
      var errorTag = $('<p>').addClass('inline-errors').text("Error: " + error.message);
      ProductsApp.form.currentView.ui[error.field].before(errorTag);
    });
  }
});

var Products = Backbone.Collection.extend({
  model: Product,
  url: '/products'
});

var NoProductsView = Backbone.Marionette.ItemView.extend({
  template: '#no-products-template'
});

var ProductRowView = Backbone.Marionette.ItemView.extend({
  tagName: 'tr',
  template: '#product-row-template',
  templateHelpers: {
    showPrice: function() {
      return '$' +
        parseFloat(this.price).
        toFixed(2).
        toString().
        replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
});

var ProductsGridView = Backbone.Marionette.CompositeView.extend({
  tagName: 'table',
  template: '#products-grid-template',
  itemView: ProductRowView,
  emptyView: NoProductsView
});

var FormView = Backbone.Marionette.ItemView.extend({
  template: '#form-template',

  events: {
    'click button': 'createNewProduct',
  },

  collectionEvents: {
    'sync': 'clearForm'
  },

  ui: {
    name: '#name',
    price: '#price',
    description: '#description'
  },

  createNewProduct: function() {
    this.collection.create(
      {
        name: this.ui.name.val(),
        price: this.ui.price.val(),
        description: this.ui.description.val()
      },
      { wait: true }
    );
  },

  clearForm: function() {
    this.ui.name.val('');
    this.ui.price.val('');
    this.ui.description.val('');
  }
});

ProductsApp.addRegions({
  form: '#form',
  list: '#list'
});

ProductsApp.addInitializer(function() {
  ProductsApp.products = new Products();

  ProductsApp.form.show(new FormView({ collection: ProductsApp.products }));
  ProductsApp.list.show(new ProductsGridView({ collection: ProductsApp.products }));
});

ProductsApp.start();
