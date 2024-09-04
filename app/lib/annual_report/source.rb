# frozen_string_literal: true

class AnnualReport::Source
  attr_reader :account, :year

  def initialize(account, year)
    @account = account
    @year = year
  end

  protected

  def year_as_snowflake_range
    (tucano::Snowflake.id_at(DateTime.new(year, 1, 1))..tucano::Snowflake.id_at(DateTime.new(year, 12, 31)))
  end
end
