class RecipientsController < ApplicationController
  def index
    render json: Recipient.all
  end

  def show
    recipient = Recipient.find(params[:id])
    render json: recipient
  end
end
