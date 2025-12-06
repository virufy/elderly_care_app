const audioCache: Record<string, string> = {};

export const setAudioBase64 = (key: string, value: string) => {
  audioCache[key] = value;
};

export const getAudioBase64 = (key: string): string | null => audioCache[key] || null;
