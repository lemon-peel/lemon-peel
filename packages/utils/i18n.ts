export const isKorean = (text: string) =>
  /([()|\u3130-\u318F\uAC00-\uD7AF])+/gi.test(text);
