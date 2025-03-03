FROM node:20-bookworm AS builder
SHELL ["/bin/bash", "-c"]
ENV SHELL=bash
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# Install pnpm
RUN npm -g install pnpm && pnpm setup && source /root/.bashrc && pnpm self-update && pnpm setup && pnpm config set store-dir "/usr/local/share/pnpm/store/v10" --global

# Install Maven (needed for OpenAPI generation)
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY . /build

RUN rm -rf $(pnpm store path) && pnpm install -g rimraf typescript tslib
RUN pnpm install --ignore-scripts
RUN cd packages/credential-showcase-openapi && mvn clean generate-sources
RUN pnpm build --filter credential-showcase-openapi
RUN pnpm build --filter credential-showcase-api-server
RUN pnpm deploy /deploy --filter credential-showcase-api-server --prod --no-optional --ignore-scripts

# Runtime stage
FROM node:20-bookworm-slim
WORKDIR /app
COPY --from=builder /deploy /app
ENV NODE_ENV=production
RUN echo PORT=3000  > .env
CMD ["node", "dist/index.js"]