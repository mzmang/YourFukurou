require 'fileutils'
include FileUtils

ROOT = __dir__.freeze
BIN = "#{ROOT}/node_modules/.bin".freeze

def cmd_exists?(cmd)
  File.exists?(cmd) && File.executable?(cmd)
end

def ensure_cmd(cmd)
  $cmd_cache ||= []
  return true if $cmd_cache.include? cmd

  paths = ENV['PATH'].split(':').uniq
  unless paths.any?{|p| cmd_exists? "#{p}/#{cmd}" }
    raise "'#{cmd}' command doesn't exist"
  else
    $cmd_cache << cmd
  end
end

file 'bower_components' do
  ensure_cmd 'bower'
  sh 'bower install'
end

file 'node_modules' do
  ensure_cmd 'npm'
  sh 'npm install --dev'
end

task :dep => %i(node_modules)

file "typings" do
  ensure_cmd 'tsd'
  sh 'tsd install'
end

task :build_browser_src => %i(typings) do
  ensure_cmd 'tsc'

  sh "tsc -p #{ROOT}/browser"
end

task :build_renderer_src do
  directory 'build'
  directory 'build/renderer'
  sh "#{BIN}/browserify -t babelify -d -o #{ROOT}/build/renderer/index.js #{ROOT}/renderer/index.jsx"
end

task :build_plugin_jsx_src do
  Dir['plugin/*/src/sink.{js,jsx}'].each do |js|
      sh "#{BIN}/browserify -t babelify -d -o #{File.dirname(File.dirname(js))}/sink.js #{js}"
  end
end

task :build_plugin_ts_src do
  Dir['plugin/*/src'].each do |dir|
    if File.exists?("#{dir}/tsconfig.json")
      ensure_cmd 'tsc'
      sh "tsc -p #{dir}"
    end
  end
end

task :build_plugin_src => %i(build_plugin_jsx_src build_plugin_ts_src)

task :build => %i(dep build_browser_src build_renderer_src build_plugin_src)

task :run do
  sh "#{ROOT}/bin/cli.js"
end

task :all => %i(build run)

