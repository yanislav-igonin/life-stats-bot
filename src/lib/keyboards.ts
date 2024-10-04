import { BoozeQuantity, MoodOfDay, SleepQuality } from "database/models";
import { Keyboard } from "grammy";

export const startKeyboard = new Keyboard()
	.add("Сон", "Бухло")
	.row()
	.add("Статистика", "Помощь");

export const sleepKeyboard = new Keyboard().add("Подъем", "Отход ко сну");

export const quantityOfBoozeKeyboard = new Keyboard().add(
	...Object.keys(BoozeQuantity),
);

export const sleepQualityKeyboard = new Keyboard().add(
	...Object.keys(SleepQuality),
);

export const moodOfDayKeyboard = new Keyboard().add(...Object.keys(MoodOfDay));
