import { APP_ENV, IS_PRODUCTION } from "./env";

export const API_PREFIX = "/line_banana";

export const HOST_CONFIG = {
  dev: "https://sentio.bbchin.com",
  prod: "https://sentio.bbchin.com",
};

export const BACKEND_API_HOST_CONFIG = {
  dev: "https://sentio-api.bbchin.com",
  prod: "https://sentio-api.bbchin.com",
};

export const HOST = HOST_CONFIG[APP_ENV as keyof typeof HOST_CONFIG];

export const BACKEND_API_HOST =
  BACKEND_API_HOST_CONFIG[APP_ENV as keyof typeof BACKEND_API_HOST_CONFIG];

export const BACKEND_API_URL = IS_PRODUCTION
  ? BACKEND_API_HOST + API_PREFIX
  : API_PREFIX;
