#!/usr/bin/ruby
# @Author: Craig Bojko
# @Date:   2017-08-17 23:54:37
# @Last Modified by:   Craig Bojko
# @Last Modified time: 2017-10-15 02:08:36

# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'PhotoUploadService'
set :repo_url, 'ssh://git@github.com/pixelventures/PhotoUploadService.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/var/www/photoUploadService'

# Default value for :scm is :git
set :scm, :git
set :user, "ubuntu"

set :default_env, { path: "~/.rbenv/shims:~/.rbenv/bin:$PATH" }

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
#
#  Link node_modules so it is shared between deploys.
# If you also have a log folder, or other folders that
# should be shared, add them here
set :linked_dirs, %w(  
  node_modules
)

set :pm2_app_name, 'PhotoUploadService'
