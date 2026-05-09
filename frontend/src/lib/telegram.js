import { WebApp } from '@twa-dev/sdk';

export const initTelegramApp = () => {
  const tg = WebApp;
  if (!tg) return;

  // სრულეკრანული რეჟიმი
  tg.expand();
  tg.ready();

  // ფერების სინქრონიზაცია
  tg.setHeaderColor('#06041A');
  tg.setBackgroundColor('#06041A');

  if (tg.BackButton) {
    tg.BackButton.hide();
  }

  return tg;
};

export const triggerHaptic = (type = 'light') => {
  if (WebApp?.HapticFeedback?.impactOccurred) {
    WebApp.HapticFeedback.impactOccurred(type);
  }
};