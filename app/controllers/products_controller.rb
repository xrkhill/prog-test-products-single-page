class ProductsController < ApplicationController
  respond_to :html, :json

  def index
    @products = Product.all
    respond_with(@product)
  end

  def show
    @product = Product.find(params[:id])
    respond_with(@product)
  end

  def create
    @product = Product.new(params[:product])
    @product.save
    respond_with(@product)
  end

  def update
    @product = Product.find(params[:id])
    @product.update_attributes(params[:product])
    respond_with(@product)
  end

  def destroy
    @product = Product.find(params[:id])
    @product.destroy
    respond_with(@product)
  end
end
