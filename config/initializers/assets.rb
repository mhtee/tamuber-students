# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')
# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w( admin.js admin.css )

# JQuery
Rails.application.config.assets.precompile += %w( jquery-3.3.1.js )

# ROSLIB
Rails.application.config.assets.precompile += %w( roslib.js )

# Map display script for first page of site
Rails.application.config.assets.precompile += %w( map.js )

# Javascript for "new" view
Rails.application.config.assets.precompile += %w( new.js )

#Javascript for "pickup" view
Rails.application.config.assets.precompile += %w( pickup.js )

