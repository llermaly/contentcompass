# T3 + Clerk + Stripe boilerplate with subscriptions for user credits


## How it works:

1. You should create with ```npx prisma studio``` StripePriceIdCredits, where priceId is the priceId of the product in stripe and credits is how much credits the user will get for subscribe to that plan

![Captura de pantalla 2023-11-26 a la(s) 11 35 08](https://github.com/abstract829/t3-clerk-stripe/assets/56497105/f02b3af2-25fa-41dd-9dc6-b06665e1fa08)

2. After your login in to the app with your clerk account, it will be vinculated to a customer in stripe

3. When you go to buy a plan it will create a unique checkout url for your customer

4. Once the payment is succesfull, a weebhook is trigger where we find which priceId did the customer bought (must be in StripePriceIdCredits) and update the user credits in the database


https://github.com/abstract829/t3-clerk-stripe/assets/56497105/7ba609a4-6e7a-4f8d-ae33-849575aa42dd

