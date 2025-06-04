#!/bin/sh

npm run prisma:generate:task

npm run prisma:migrate:task:deploy init

npm run build:task:service

npm run start:task:service:prod