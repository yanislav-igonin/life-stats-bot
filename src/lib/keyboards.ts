import { Keyboard } from 'grammy';

export const startKeyboard = new Keyboard()
  .add('Сон', 'Помощь')
  .row()
  .add('Статистика');

export const sleepKeyboard = new Keyboard().add('Подъем', 'Отход ко сну');

export const sleepQualityKeyboard = new Keyboard().add(
  '😡',
  '😠',
  '🤨',
  '😌',
  '🥹',
);

export const moodOfDayKeyboard = new Keyboard().add(
  '😡',
  '😠',
  '🤨',
  '😌',
  '🥹',
);
