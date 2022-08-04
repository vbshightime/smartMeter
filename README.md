# smartMeterWebsite
## To Update the website content to s3 use following
aws s3 sync ./public/ s3://racaan.com

## To create cloudfront invalidation
aws cloudfront create-invalidation --distribution-id E1MJHVJ9KHRR83 --paths "/*"