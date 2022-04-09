# TeleShop
> TeleShop is an e-commerce application that has an integration built between Telegram and web app. It uses Telegram as a client to serve customers, while the web app acts as a CRM system for shop owners to manage their shop.

## Table of Contents
  - [Demo](#demo)
  - [Features](#features)
  - [Improvements](#improvements)
  - [Deployment](#deployment)

## Demo
Demo can be found on Telegram via @teleshop_beta_bot. A dummy [visa card](https://stripe.com/docs/testing#charges-api) can be used for testing of the payment - 4242 4242 4242 4242 in Telegram.

<i>Note that the responses might be slow due to Heroku's web dyno sleeping, do wait for a couple of seconds for the bot to respond! </i>

## Features
| Feature          | Description                                                                                                                        |      Released      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | :----------------: |
| Message Cleanup  | Messages that are sent between the user and bot are cleared upon each transition in scenes                                         | :heavy_check_mark: |
| Live Stock Count | Users are able to capture updated stock counts and reserve the items in their cart                                                 | :heavy_check_mark: |
| Payment          | Integration with Stripe has been provided for users to transact with shops                                                         | :heavy_check_mark: |
| Voucher Codes    | Users are able to enter voucher code provided by the shop owners                                                                   | :heavy_check_mark: |
| Order Message    | Users are able to leave a note on their order for the shop owners                                                                  | :heavy_check_mark: |
| Order Hogging    | Cron job will be run daily midnight to prevent users from hogging the items for too long                                           | :heavy_check_mark: |
| Order Date       | Users are able to select their delivery date (if applicable)                                                                       | :heavy_check_mark: |
| Order Limit      | Each order is limited to [$13,725.35](https://core.telegram.org/bots/payments#supported-currencies) which is supported by Telegram | :heavy_check_mark: |
| Web Dashboard    | Shop owners are able to upload their products via the dashboard                                                                    |        :x:         |

## Improvements
- Develop a full fledged dashboard using Next.js.
- Currently, the bot is being deployed via a hacky way using Express.js while running Telegraf in the background. For production usage, optimise by changing to [webhooks](https://telegraf.js.org/#webhooks).

## User Flow
<img src="./images/UX Flow.PNG" />

## Database Design
<img src="./images/DB Design.PNG" />

## Deployment
#### Local Deployment
```
git clone https://github.com/jeraldlyh/telegram-shop

cd telegram && npm i
npm run start
```
#### Environment Variables
| Name             | Description                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `BOT_TOKEN`      | Telegram bot token from [BotFather](https://core.telegram.org/bots#3-how-do-i-create-a-bot)               |
| `DATABASE_URL`   | Postgres database URL                                                                                     |
| `PGSSLMODE`      | Requires a SSL TCP/IP connection with the database (set to 'require', only required if hosting on Heroku) |
| `PROVIDER_TOKEN` | Stripe [provider token](https://core.telegram.org/bots/payments#a-bot-invoice) provided by Telegram       |
| `MODE`           | Sets the mode of the environment (set to 'demo' to allow seeding of data upon using commands)             |
