#!/usr/bin/env ruby
# frozen_string_literal: true

head = File.read('./demo/partials/head.html')
tail = File.read('./demo/partials/tail.html')

Dir.glob('./demo/*.html').each do |file|
  contents = File.read(file).match(/(<!-- head -->\n(.*)\n<!-- tail -->)/m)[1]

  File.open(file, 'w') do |f|
    f.write "#{head}\n#{contents}\n#{tail}"
  end
end
