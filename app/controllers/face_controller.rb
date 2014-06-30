class FaceController < ApplicationController
	require 'nokogiri'
	require 'active_support'
  skip_before_filter :verify_authenticity_token ,:only=>[:parse]

	def index
	end

	def parse
		upload_file = params[:imgFace]
		limitOfReliability = params[:limitOfReliability].to_f

		#TODO: サイズをチェックして返す
    if(upload_file.size > 2000000) then
      return render json: ActiveSupport::JSON.encode(errCode: 1)
    end

    conn = Faraday.new(:url => 'http://detectface.com') do |builder|
     builder.request :multipart
     builder.request :url_encoded
     builder.adapter :net_http
    end

    payload = { :profile_pic => Faraday::UploadIO.new(upload_file.tempfile.path, 'image/jpeg') }
    res = conn.post '/api/detect', payload

    m = Hash.new
    Nokogiri::XML(res.body).css("faces :first features point").each do |e|
			# puts e['id']
			if /M3|M7|F6/ =~ e['id'] then
        if e['s'].to_f >= limitOfReliability then
          m[e['id'].downcase + "_x"] = e['x']
          m[e['id'].downcase + "_y"] = e['y']
        else
          return render json: ActiveSupport::JSON.encode(errCode: 2)
        end
      end
    end

    # 一つも座標が取得できなければエラーにする。
    m[:errCode] = 2 if m.size == 0

    render json: ActiveSupport::JSON.encode(m)
  end

  def access_token
    conn = Faraday.new(:url => 'https://datamarket.accesscontrol.windows.net') do |builder|
     builder.request :url_encoded
     builder.adapter :net_http
   end
   res = conn.post '/v2/OAuth2-13', {
     :client_id => "syabikuri",
     :client_secret => "QOj9v30w3iRepb7qEmVvfEXlBGVUOCkt+/8xVxBkYgg=",
     :scope => "http://api.microsofttranslator.com",
     :grant_type => "client_credentials"
   }

  		# JSON -> HashMapに変換
  		r = ActiveSupport::JSON.decode(res.body)
  		render text: r['access_token']
   end
 end
