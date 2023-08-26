class AwardsController < ApplicationController
  PAGE_SIZE = 50

  def index
    page = params[:page]&.to_i || 1

    awards = Award.all
    awards = awards.where(filing_id: params[:filing_id].to_i) unless params[:filing_id].nil?
    awards = awards.where(amount: params[:min_amount].to_f..) unless params[:min_amount].nil?
    awards = awards.where(amount: ..params[:max_amount].to_f) unless params[:max_amount].nil?
    awards = awards.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE)

    render json: awards
  end

  def show
    award = Award.find(params[:id])
    render json: award
  end
end
