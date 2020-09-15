# Morchana Backend

## Setup

```
nano ~/.aws/config
```

Then setup credential as following
```
[default]
region=
aws_access_key_id=
aws_secret_access_key=
```


## Development

```
npm install
npm run serve
```

## Deployment

### Deploy amplify to s3

```
amplify publish
```

S3 URL (w/o cloudfront): https://morchanabackend-prod.s3-ap-southeast-1.amazonaws.com/index.html
Cloudfront URL         : https://d2lc1bkamkz5ai.cloudfront.net
