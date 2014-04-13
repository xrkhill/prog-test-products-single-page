module ApplicationHelper
  def products_array_as_json_helper(products)
    ActiveModel::ArraySerializer.new(products, each_serializer: ProductSerializer).to_json
  end
end
