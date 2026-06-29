import { firstValueFrom } from 'rxjs';

import { MESSAGE_TEXT } from '../constants/message-text';
import { ArticleService } from '../services/article/article.service';
import { UiToastService } from '../services/toast/ui-toast.service';

export interface BuyArticleOptions {
  articleService: ArticleService;
  toastService: UiToastService;
  articleId: number;
  onSuccess?: () => void;
}

export async function buyArticleWithToast({
  articleService,
  toastService,
  articleId,
  onSuccess,
}: BuyArticleOptions): Promise<void> {
  try {
    await firstValueFrom(articleService.buyArticle(articleId));
    onSuccess?.();
    toastService.success(MESSAGE_TEXT.articleDetail.buySuccess);
  } catch (err) {
    const status = typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status: unknown }).status)
      : 0;
    const message = status === 400
      ? MESSAGE_TEXT.articleDetail.buyUnavailable
      : MESSAGE_TEXT.articleDetail.operationError;

    toastService.error(message);
  }
}
