FROM node:23-bookworm

RUN apt-get update && \
    apt-get install -y npm curl

# installing go
RUN mkdir -p "/usr/local"
RUN curl -L -o /usr/local/go.tar.gz https://go.dev/dl/go1.24.1.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf /usr/local/go.tar.gz && rm /usr/local/go.tar.gz
ENV PATH="$PATH:/usr/local/go/bin"

RUN mkdir /src
WORKDIR /src

COPY . .

WORKDIR /src
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

WORKDIR /src/backend/settingsAndAnalyticsService
RUN go mod download
RUN go build ./cmd/main.go    

EXPOSE 3000
