# ---------- 1. Dependencies ----------
# FROM node:20-alpine AS deps
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# # ---------- 2. Build ----------
# FROM node:20-alpine AS builder
# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# RUN npx prisma generate
# RUN npm run build

# # ---------- 3. Production ----------
# FROM node:20-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# # Only copy what we need
# COPY --from=builder /app ./

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "dev"]