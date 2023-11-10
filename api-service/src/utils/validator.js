export const validator = {
  obj: {
    required: (obj, requiredField) => {
      if (!obj || !obj[requiredField]) {
        throw new Error(`${requiredField} is required`);
      }
      return true;
    }
  },
  array: {
    minLen: (arr, minLen) => {
      if (arr.length < minLen) {
        throw new Error(`Array must be greater than ${minLen}`);
      }
      return true;
    },
    maxLen: (arr, maxLen) => {
      if (arr.length > maxLen) {
        throw new Error(`Array must be less than ${maxLen}`);
      }
      return true;
    },
    eachString: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'string') {
          throw new Error('Each element in array must be string');
        }
      }
    }
  }
}