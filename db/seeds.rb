# frozen_string_literal: true

Chewy.strategy(:tucano) do
  Rails.root.glob('db/seeds/*.rb').each do |seed|
    load seed
  end
end
