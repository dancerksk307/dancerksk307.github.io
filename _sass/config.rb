# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
# �f�B���N�g���ݒ�

http_path = "/"
css_dir = "../css"
sass_dir = ""
images_dir = "../img"
javascripts_dir = "../js"
cache = false

Encoding.default_external = 'utf-8'

# You can select your preferred output style here (can be overridden via the command line):
# �o�͌`���ݒ�  :expanded(�f�t�H���g) :nested() :compact(�X�^�C����s���o) :compressed(ALL��s)
output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# Compass�Ŋg�����ꂽ�֐��Ŏg��URL(image-url()�̃p�X)���A��΃p�X(false)�����΃p�X(true)�����w��
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# �o�͎��̃R�����g�ݒ�
line_comments = false

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# SCSS�L�@��SASS�L�@�؂�ւ�
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

# �摜sprite�̃t�@�C�����̖���������
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
  end
end

# Autoprefixer�ݒ�
require 'autoprefixer-rails'
require 'csso'

on_stylesheet_saved do |file|
  css = File.read(file)
  File.open(file, 'w') do |io|
    # ���̉�������������
    # io << AutoprefixerRails.process(css)
    io << AutoprefixerRails.process(css, browsers: ['last 2 versions', 'ie 9', "ios >= 6", "android >= 2.3"])
  end
end