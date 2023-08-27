class MainController < ApplicationController
  def index
    @page = "home"
    render "react_page"
  end

  def awards
    @page = "awards"
    render "react_page"
  end
end
