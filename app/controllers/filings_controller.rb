class FilingsController < ApplicationController
  def index
    render json: Filing.all
  end

  def show
    filing = Filing.find(params[:id])
    render json: filing
  end
end
