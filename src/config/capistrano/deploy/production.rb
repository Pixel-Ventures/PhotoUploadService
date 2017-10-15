#!/usr/bin/ruby
# @Author: Craig Bojko
# @Date:   2017-08-17 23:25:04
# @Last Modified by:   Craig Bojko
# @Last Modified time: 2017-09-20 17:13:39

server 'craigandhannah.com', user: 'ubuntu', roles: %w{app}
set :ssh_options, {
  keys: %w(/home/ubuntu/.ssh/id_rsa),
  forward_agent: false,
  user: 'ubuntu',
  auth_methods: %w(publickey)
}
