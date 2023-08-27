class Api::FilersController < ApplicationController
  def index
    render json: Api::Filer.all
  end

  def show
    filer = Api::Filer.find(params[:id])
    render json: filer
  end
end
