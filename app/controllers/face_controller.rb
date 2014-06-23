class FaceController < ApplicationController
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
  	#TODO: ここに文章を送ってmp3に変換して返すメソッドを記載する。
  end
end
