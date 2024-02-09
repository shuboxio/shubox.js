#!/usr/bin/env ruby
# frozen_string_literal: true

head = File.read('./demo/partials/head.tmpl')
tail = File.read('./demo/partials/tail.tmpl')

Dir.glob('./demo/*.html').each do |file|
  match = File
          .read(file)
          .match(/(<!-- head ([a-zA-Z ]*) -->\n(.*)\n<!-- tail -->)/m)
  contents   = match[1]
  title      = match[2]
  body_class = title.downcase.gsub(' ', '-')
  head       = head.gsub(%r{<title>.*</title>}, "<title>#{title}</title>")
  head       = head.gsub(/<body.*>/, %(<body class="#{body_class}">))

  File.open(file, 'w') do |f|
    f.write "#{head}\n#{contents}\n#{tail}"
  end
end
