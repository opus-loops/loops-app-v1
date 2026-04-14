# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=10.27.0

FROM node:${NODE_VERSION} AS base

WORKDIR /home/app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate


FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN HUSKY=0 pnpm install --frozen-lockfile


FROM base AS builder

COPY --from=deps /home/app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=app_env,target=/home/app/.env,required=false \
    pnpm run build


FROM base AS prod-deps

COPY package.json pnpm-lock.yaml ./

RUN HUSKY=0 pnpm install --prod --frozen-lockfile


FROM node:${NODE_VERSION} AS production

WORKDIR /home/app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
ENV ENV_FILE_PATH=/home/app/.env

COPY --from=prod-deps --chown=node:node /home/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/app/.output ./.output
COPY --from=builder --chown=node:node /home/app/package.json ./package.json

USER node

EXPOSE 3001

CMD ["sh", "-c", "if [ -f \"${ENV_FILE_PATH}\" ]; then exec node --env-file=\"${ENV_FILE_PATH}\" --import ./.output/server/instrument.server.mjs .output/server/index.mjs; else exec node --import ./.output/server/instrument.server.mjs .output/server/index.mjs; fi"]


FROM base AS development

COPY --from=deps /home/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "pnpm dev -- --host 0.0.0.0"]

