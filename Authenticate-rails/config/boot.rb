ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" 
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
