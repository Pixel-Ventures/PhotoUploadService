
server 'localhost', user: 'Craig', roles: %w{app}
set :ssh_options, {
  keys: %w(/Volumes/Data/Craig/.ssh/id_rsa),
  forward_agent: false,
  user: 'Craig',
  auth_methods: %w(publickey)
}
