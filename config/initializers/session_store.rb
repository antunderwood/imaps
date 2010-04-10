# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_iOSmap_session',
  :secret      => '2e1a739bea3bd5df98b602143563ef503dee9cda4dc7d12532fb30e32f06c6d47f12c7ee3f8f4c9b3d1133306b99c4194a8e151b2f65b44870c5acd315b546c4'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
