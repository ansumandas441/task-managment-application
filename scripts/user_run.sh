#!/bin/sh

npm run prisma:generate:user

npm run prisma:migrate:user init

npm run build:user:service

npm run start:user:service:prod