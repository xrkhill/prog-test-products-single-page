require 'spec_helper'

describe ProductSerializer do
  it "creates JSON for API" do
    product = Product.new(name: "Widget", description: "Useful trinket", price: 9.99)
    product.id = 1

    serializer = ProductSerializer.new product

    expect(serializer.to_json).to eql('{"id":1,"name":"Widget","description":"Useful trinket","price":"9.99"}')
  end
end
