desc "Used for testing DB seeding"
task :get_filings do
  Rails.application.load_seed
end