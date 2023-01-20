const shorteningMap = new Map([["compsci", "cs"]]);

/**
 * @description - Cleans a course code by removing spaces and replacing matches in the shorteningMap
 * @author John Schiltz
 * @export
 * @param course_code - the course code to clean
 * @return {*} - the cleaned course code
 */
export function cleanCourseCode(course_code: string): string {
  let clean_course_code = course_code.toLowerCase();
  shorteningMap.forEach((value, key) => {
    clean_course_code = clean_course_code.replace(key, value);
  });
  return clean_course_code.trim();
}

/**
 * @description - Removes all html tags from a string and adds spaces after periods
 * @author Nathen Goldsborough
 * @export
 * @param s
 * @return {*}
 */
export function removeHTML(s: string): string {
  return s.replace(/<\/?[^>]+(>|$)/g, "").replace(".", ". ");
}
