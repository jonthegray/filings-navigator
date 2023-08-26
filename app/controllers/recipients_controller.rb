class RecipientsController < ApplicationController
  def index
    recipients = Recipient.all
    recipients = recipients.where(state: params[:state]) unless params[:state].nil?
    recipients = recipients.joins(:awards).where(awards: {filing_id: params[:filing_id]}) unless params[:filing_id].nil?
    recipients = recipients.joins(:awards).where(awards: {amount: params[:min_amount].to_f..}) unless params[:min_amount].nil?
    recipients = recipients.joins(:awards).where(awards: {amount: ..params[:max_amount].to_f}) unless params[:max_amount].nil?

    render json: recipients
  end

  def show
    recipient = Recipient.find(params[:id])
    render json: recipient
  end
end
