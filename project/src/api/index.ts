import api from './client';
import authApi from './auth';
import newsApi from './news';
import scheduleApi from './schedule';
import mediaApi from './media';

export { api, authApi, newsApi, scheduleApi, mediaApi };

// デフォルトエクスポート
export default {
  api,
  auth: authApi,
  news: newsApi,
  schedule: scheduleApi,
  media: mediaApi
}; 