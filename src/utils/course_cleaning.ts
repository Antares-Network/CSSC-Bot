import { IClass } from "../models/classModel";
const shorteningMap = new Map([["compsci ", "cs"]]);

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

/**
 * @description - Gets the course name, if it is a duplicate, it adds the title to the end of the name
 * @author John Schiltz
 * @export
 * @param course
 * @return - The course name
 */
export function getCourseName(course: IClass) {
  return course.DUPE === true ? `${course.NAME}-${course.TITLE}` : course.NAME;
}

/**
 * @description - Cleans the course title string for computer science courses by removing the "advanced topics in computer science:" part of the title
 * @author John Schiltz
 * @export
 * @param course
 * @return - The cleaned string
 */
export function cleanCompSciTitle(s: string): string {
  return s.replace(/(?:advanced )?topics in computer science:/gim, "").trim();
}
