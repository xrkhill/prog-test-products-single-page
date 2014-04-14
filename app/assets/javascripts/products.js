var ProductsApp = new Backbone.Marionette.Application();

var Product = Backbone.Model.extend({
  validate: function(attrs, options) {
    if (_.isEmpty(attrs.name))
      return { field: 'name', message: 'Name cannot be blank' };

    var priceAsFloat = parseFloat(attrs.price);
    if (_.isEmpty(attrs.price) || _.isNaN(priceAsFloat) || priceAsFloat < 0)
      return { field: 'price', message: 'Price must be a non-negative number' };
  },

  initialize: function() {
    this.on('invalid', function(model, error) {
      ProductsApp.execute('clearErrors');
      var errorTag = $('<p>').addClass('inline-errors').text(error.message);
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
      // format number with comma at thousands and two decimals
      return '$' +
        parseFloat(this.price).
        toFixed(2).
        toString().
        replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  },

  modelEvents: {
    'change': function() {
      this.render();
    }
  },

  ui: {
    'delete': 'button.delete',
    'edit': 'button.edit'
  },

  events: {
    'click @ui.delete': 'deleteProduct',
    'click @ui.edit': 'editProduct'
  },

  deleteProduct: function() {
    if (confirm('Are you sure you want to delete the product "' + this.model.attributes.name + '"?')) {
      this.model.destroy({
        wait: true,
        error: function(model, response) {
          alert("Sorry, something went wrong! Please try again");
        }
      });
    }
  },

  editProduct: function() {
    ProductsApp.form.show(new EditView({ model: this.model }));
  }
});

var ProductsGridView = Backbone.Marionette.CompositeView.extend({
  tagName: 'table',
  template: '#products-grid-template',
  itemView: ProductRowView,
  itemViewContainer: 'tbody',
  emptyView: NoProductsView
});

var FormView = Backbone.Marionette.ItemView.extend({
  template: '#form-template',

  events: {
    'click button': 'createProduct'
  },

  collectionEvents: {
    'sync': function() {
      ProductsApp.execute('clearForm', this);
    }
  },

  ui: {
    name: '#name',
    price: '#price',
    description: '#description'
  },

  createProduct: function() {
    this.collection.create({
        name: this.ui.name.val(),
        price: this.ui.price.val(),
        description: this.ui.description.val()
      },{
        wait: true
      });
  }
});

var EditView = Backbone.Marionette.ItemView.extend({
  template: '#edit-template',

  events: {
    'click button': 'updateProduct',
    'click #done': 'done'
  },

  ui: {
    name: '#name',
    price: '#price',
    description: '#description'
  },

  updateProduct: function() {
    var editView = this;

    this.model.save({
        name: this.ui.name.val(),
        price: this.ui.price.val(),
        description: this.ui.description.val()
      },{
        wait: true,
        success: function(model, response, options){
          ProductsApp.execute('clearErrors');
        },
        error: function(model, response, options){
          ProductsApp.execute('clearErrors');
          alert("Sorry, there was a problem saving your changes. Please try again.");
        }
      });
  },

  done: function() {
    ProductsApp.form.show(new FormView({ collection: ProductsApp.products }));
  }
});

ProductsApp.commands.setHandler('clearForm', function(view) {
  view.ui.name.val('');
  view.ui.price.val('');
  view.ui.description.val('');
  ProductsApp.execute('clearErrors');
});

ProductsApp.commands.setHandler('clearErrors', function() {
  $('.inline-errors').remove();
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
