type Sponsor = {
  name: string;
  name_cn?: string;
  img: string;
  imgL?: string;
  url: string;
  slogan: string;
  slogan_cn?: string;
  slogan_index?: string;
  banner_img?: string;
  className?: string;
  isDark?: boolean;
};

export const rightRichTextSponsors: Sponsor[] = [];

export const rightLogoSmallSponsors: Sponsor[] = [];

export const leftCustomImgSponsors: Sponsor[] = [];

export const platinumSponsors = [
  ...leftCustomImgSponsors,
  ...rightRichTextSponsors,
];

export const leftLogoSponsors = [];

export const goldSponsors = [...rightLogoSmallSponsors, ...leftLogoSponsors];
