# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
# ディレクトリ設定

http_path = "/"
css_dir = "../css"
sass_dir = ""
images_dir = "../img"
javascripts_dir = "../js"
cache = false

Encoding.default_external = 'utf-8'

# You can select your preferred output style here (can be overridden via the command line):
# 出力形式設定  :expanded(デフォルト) :nested() :compact(スタイル一行書出) :compressed(ALL一行)
output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# Compassで拡張された関数で使うURL(image-url()のパス)を、絶対パス(false)か相対パス(true)かを指定
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# 出力時のコメント設定
line_comments = false

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# SCSS記法⇔SASS記法切り替え
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

# 画像spriteのファイル名の末尾を消去
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
  end
end

# Autoprefixer設定
require 'autoprefixer-rails'
require 'csso'

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    # この下を書き換える
    # io << AutoprefixerRails.process(css)
    io << AutoprefixerRails.process(css, browsers: ['last 2 versions', 'ie 9', "ios >= 6", "android >= 2.3"])
  end
end