export const getPaginationArray = (current: number, pages: number): { nums: number[]; leftBack: boolean; rightForward: boolean } => {
  if (!current || !pages) return { nums: [], leftBack: false, rightForward: false };
  if (pages > 6) {
    if (current <= 4) return { nums: [...Array(5).keys()].map((x): number => ++x), leftBack: false, rightForward: true };
    if (pages - current <= 3) return { nums: [...Array(5).keys()].map((x): number => x + pages - 4), leftBack: true, rightForward: false };
  } else {
    return { nums: [...Array(pages).keys()].map((x): number => ++x), leftBack: false, rightForward: false };
  }
  return { nums: [...Array(5).keys()].map((x): number => x + current - 2), leftBack: true, rightForward: true };
};
