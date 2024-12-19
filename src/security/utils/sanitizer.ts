import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { isPlainObject } from 'lodash';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return purify.sanitize(input, { ALLOWED_TAGS: [] });
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  if (isPlainObject(input)) {
    return Object.keys(input).reduce((acc, key) => ({
      ...acc,
      [key]: sanitizeInput(input[key])
    }), {});
  }

  return input;
}; 