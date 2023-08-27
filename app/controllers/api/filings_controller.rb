class Api::FilingsController < ApplicationController
  def index
    filings = Api::Filing.all
    filings = filings.where(filer_id: params[:filer_id].to_i) unless params[:filer_id].nil?

    render json: filings
  end

  def show
    filing = Api::Filing.find(params[:id])
    render json: filing
  end
end
