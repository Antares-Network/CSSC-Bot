const shorteningMap = new Map([["computer science", "cs"]]);
export function cleanCourseCode(s: string) {
  let ret_str = s.toLowerCase();
  shorteningMap.forEach((value, key) => {
    ret_str = ret_str.replace(key, value);
  });
  return ret_str.trim();
}

export function removeHTML(s: string): string {
  return s.replace(/<\/?[^>]+(>|$)/g, "").replace(".", ". "); // cleans all html tags and adds spaces after periods
}
