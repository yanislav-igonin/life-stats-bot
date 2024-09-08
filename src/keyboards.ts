import { Keyboard } from 'grammy';

export const startKeyboard = new Keyboard().add('Сон', 'Помощь');

export const sleepKeyboard = new Keyboard().add('Подъем', 'Отход ко сну');

export const sleepQualityKeyboard = new Keyboard().add('😡', '🤨', '🥹');
