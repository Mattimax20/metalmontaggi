# ============================================================
#  Strapi Production Image
# ============================================================
FROM node:18-alpine AS base

RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    vips-dev

WORKDIR /opt/app

# ── Install + Build ───────────────────────────────────────
FROM base AS builder
ENV NODE_ENV=production
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# ── Runner ────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/build ./build
COPY --from=builder /opt/app/config ./config
COPY --from=builder /opt/app/src ./src
COPY --from=builder /opt/app/public ./public
COPY package.json ./

RUN mkdir -p public/uploads && \
    chown -R node:node /opt/app

USER node
EXPOSE 1337

CMD ["node_modules/.bin/strapi", "start"]
