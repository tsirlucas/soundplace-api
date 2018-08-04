type Default = {
  url: string;
  width: number;
  height: number;
};

type Medium = {
  url: string;
  width: number;
  height: number;
};

type High = {
  url: string;
  width: number;
  height: number;
};

type Standard = {
  url: string;
  width: number;
  height: number;
};

type Maxres = {
  url: string;
  width: number;
  height: number;
};

export type YoutubeThumbnails = {
  default: Default;
  medium: Medium;
  high: High;
  standard: Standard;
  maxres: Maxres;
};
