class FaceController < ApplicationController
	require 'nokogiri'
	require 'active_support'

	def index
	end

	def parse
	  	#TODO: ここに顔を解析して座標を取得する処理を記載する。　とりあえずYahooのAPIを呼び出し時のサンプルを貼り付ける。
	  	conn = Faraday.new(:url => 'http://jlp.yahooapis.jp') do |builder|
	  		builder.request :url_encoded
	  		builder.response :logger
	  		builder.adapter :net_http
	  	end
	  	res = conn.get '/KouseiService/V1/kousei', {
	  		:appid => "dj0zaiZpPTxxxxxxxxxxxxxxxxxxxxxxxxxxxxWVyc2VjcmV0Jng9NDI-",
	  		:sentence => sentence,
	  	}
	  	Nokogiri::XML(res.body)
	end
	
	def speak
		text = "こんにちわ"

		conn = Faraday.new(:url => 'http://api.microsofttranslator.com/V2/Ajax.svc/') do |builder|
			builder.request :url_encoded
	  		builder.response :logger
			builder.adapter :net_http
		end
		res = conn.get 'Speak', {
			:appId => "Bearer" + " " + access_token,
			:text => text,
			:language => "ja",	
			:format => "audio/mp3"
		}		
		render text: res.body
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
