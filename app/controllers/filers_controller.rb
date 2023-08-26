class FilersController < ApplicationController
  def index
    render json: Filer.all
  end

  def show
    filer = Filer.find(params[:id])
    render json: filer
  end
end
