import { Keyboard } from 'grammy';

export const startKeyboard = new Keyboard();
startKeyboard.add('Сон', 'Помощь');

export const sleepKeyboard = new Keyboard();
sleepKeyboard.add('Подъем', 'Отход ко сну');
