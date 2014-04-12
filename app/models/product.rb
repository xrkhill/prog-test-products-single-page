class Product < ActiveRecord::Base
  attr_accessible :description, :name, :price

  validates :name, presence: true

  validates :price, numericality: { greater_than_or_equal_to: 0.0 }
end
