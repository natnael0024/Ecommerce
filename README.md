# MyStore: Ecommerce platform
MyStore is an eCommerce platform built with Laravel (backend) and Next.js (frontend). It offers a seamless shopping experience and an intuitive admin dashboard to manage products, orders, users, roles, permissions and view analytics. Perfect for businesses of all sizes, MyStore combines performance, security, and flexibility.

![Preview](https://upwork-usw2-prod-agora-file-storage.s3.us-west-2.amazonaws.com/profile/portfolio/thumbnail/46c4264426bc28bd19825c5b67821ec8?response-content-disposition=inline%3B%20filename%3D%22image_original%22%3B%20filename%2A%3Dutf-8%27%27image_original&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG0aCXVzLXdlc3QtMiJHMEUCIADRo6dBZ2XVPG5eifv5N%2BmctsXizelq6jJ7g7HmOOaVAiEAon%2BXhtW%2BbeZJ0wdC2%2BvzvYFijATI7Urbj%2BuOYN9pkAIqmQUIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw3Mzk5MzkxNzM4MTkiDINO3%2Bb2KlmsY4xDcyrtBNPAJngoGDoCeuEVeM%2B3FsStthacZUZUmRw4lHztb2HT%2FGwZ0UCssgtDFwVC%2BJAxg69DFs071L0W4QwrACJu2XPkCI5mhvOYdu%2F%2FA2UZ4hydgLpBI5MSnKCr7HhyBncXR53PGfhij3bD%2BjVPgRHAGtUFGZB85orG3XTVKUMxdvh2dSSWrbf7KMH1Sq%2Fc8%2FYiuPh3V8W2Yd14G6%2BWVANJvmMyCBBHrPLcvvT%2Fzqez5J8pu1PueYtTJgEedYgBGc2XrQenBF0JCpEWLOVGcpdmTD0g4EL4ywlylKQjG5kShPfiJj4J9Rmks4FETyczwrels1lA0VDeZDW6VXSSoPcZSbvCH7kecYEiHgYqwIzygQcfHs3kg2ObNYud3mn9%2F1BSjVXJGev21k%2BnldVSF3%2BwrBgOQGmKigGVsBKsEUTJJ3jPxkS2DThXGUDu78KO05EgM7ZizumZzZ1WgKRM%2FXjoHqLF5fo79cqGD8%2BVFDgZP6D1KKIAQUhVjrfrHrih3IMl5jLiNrkK8qsXrGp0N0Sqf2aPmM1YAYwwHAyIkY%2F0hstGLtmXcatTfwG%2FJuil28%2F2tLdnmIFo%2F6P2uyscZ3pv0jsEBTE4jav%2FtRtScsGGpWSYfO9R8f0Yw4KCpbhEzg1uLH9qXWnDSv8QanRXqIT5Heda6yqQRpu7IQGS00%2FfJYrp8l8KWdtWiJJ3mNAQrD9X26Jo%2FIbEn8SAVOHLVIFbpxa92rFyCwZ6Rm%2BY7t57A2sZ2T42C8HPSj%2BQP7Z6Lx5OoXm5yFj%2BYNRBBt5dlwKWFOSD%2FalaWQKS74WcqTnbe07cBD7gkuGHk%2FvSn5l72DCL5tfEBjqbAZMk9PyoRqiLgZ5Q7i2rwZzm2Cxe6%2B75wBfG7HXlgfZyn1bVDj2sdw9eeIk6WkUMIC1yXv9zFWtNFcQzucQhK41frqBODYTS3JsPvFtkU74J3sF7ywyoFmOyQQoOAouLVbQPmr2l%2BQndVGzbBAQCANDrqeEKwovXBALnq4YJdnTZ7JDG7nXDNqMCrOWJBFVvRKSnkb4PrIbIpJKM&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250808T131511Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1799&X-Amz-Credential=ASIA2YR6PYW55ABPOOSJ%2F20250808%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=27241c474668b42fc93cf0254ee3847438abd1c089570b49b55e05b11be608c2)

##  Setup & Installation

Follow these steps to get **MyStore** up and running locally.

### 1. Clone the repository
```bash
git clone https://github.com/natnael0024/Ecommerce.git
cd Ecommerce
cd laravel_api
cp .env.example .env
```
* Open .env and update database credentials, e.g.:
```bash
# DB_DATABASE=your_db
# DB_USERNAME=your_user
# DB_PASSWORD=your_password
```

### 2. Set up the backend (Laravel API)
```bash
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed   # if seeders are included
php artisan serve
```
### 3. Set up the frontend (Next.js client)
```bash
cd ../client
cp .env.local.example .env.local
# Update environment variables if needed, for example:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

npm install
npm run dev
```
The frontend will be available at http://localhost:3000



