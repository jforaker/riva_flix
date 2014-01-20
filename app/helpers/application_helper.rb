module ApplicationHelper
  def my_button_to name, options = {}, html_options = {} # or some variation
                                                         # eg. deal with options hash the way button_to deals with it here?
    content_tag :button_to, options, html_options  do
      raw name
    end
  end

  def flash_notifications
    message = flash[:error] || flash[:notice]

    if message
      type = flash.keys[0].to_s
      javascript_tag %Q{$.notification({ message:"#{message}", type:"#{type}" });}
    end
  end
end
