class Award < ApplicationRecord
  belongs_to :filing
  belongs_to :recipient
end
