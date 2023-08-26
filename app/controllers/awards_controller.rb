class AwardsController < ApplicationController
  PAGE_SIZE = 50

  def index
    page = params[:page]&.to_i || 1

    awards = Award.all.drop(page * PAGE_SIZE).take(PAGE_SIZE)
    render json: awards
  end

  def show
    award = Award.find(params[:id])
    render json: award
  end
end
