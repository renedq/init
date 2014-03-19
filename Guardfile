# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# Run JS and CoffeeScript files in a typical Rails 3.1 fashion, placing Underscore templates in app/views/*.jst
# Your spec files end with _spec.{js,coffee}.

spec_location = "spec/javascripts/%s_spec"

# uncomment if you use NerdCapsSpec.js
# spec_location = "spec/javascripts/%sSpec"

notification :off

guard 'jasmine-headless-webkit' do
  watch(%r{^public/index.html$}) { `clear && tidy -eq --drop-empty-elements no public/index.html` }
  watch(%r{^public/(.*)\.js$}) { 
    `ctags public/js/darkness.js`
    'spec/javascripts/**/*'
  }
  watch(%r{^(spec/javascripts/.*\.js)}) { |m| m }
end

guard 'livereload' do
  watch(%r{public/.+\.(css|js|html)})
end
