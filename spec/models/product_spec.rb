require 'spec_helper'

describe Product do
  let(:valid_attributes) do
    {
      name: "Fannypack",
      description: "Great for camping",
      price: 9.99
    }
  end

  it "should accept name, description, and price attributes" do
    expect { Product.create valid_attributes }.not_to raise_error
  end

  describe "#name" do
    it "should not be blank" do
      expect(Product.new name: "", price: 42).not_to be_valid
    end

    it "should be present" do
      expect(Product.new name: "foo", price: 42).to be_valid
    end
  end

  describe "#price" do
    it "should not be negative" do
      expect(Product.new name: "foo", price: -1.00).not_to be_valid
    end

    it "should be positive" do
      expect(Product.new name: "foo", price: 2.00).to be_valid
    end
  end

end
