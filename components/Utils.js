module.exports = {
  constants: {
    modifiers: {
      DND_MODIFIERS: [
        {
          threshold: 1,
          modifier: -5,
        },
        {
          threshold: 2,
          modifier: -4,
        },
        {
          threshold: 4,
          modifier: -3,
        },
        {
          threshold: 6,
          modifier: -2,
        },
        {
          threshold: 8,
          modifier: -1,
        },
        {
          threshold: 10,
          modifier: 0,
        },
        {
          threshold: 12,
          modifier: 1,
        },
        {
          threshold: 14,
          modifier: 2,
        },
        {
          threshold: 16,
          modifier: 3,
        },
        {
          threshold: 18,
          modifier: 4,
        },
        {
          threshold: 20,
          modifier: 5,
        },
        {
          threshold: 22,
          modifier: 6,
        },
        {
          threshold: 24,
          modifier: 7,
        },
        {
          threshold: 26,
          modifier: 8,
        },
        {
          threshold: 28,
          modifier: 9,
        },
        {
          threshold: 30,
          modifier: 10,
        },
      ],
    },
  },

  /**
   * Get random integer from range [min, max]
   * @param min
   * @param max
   * @returns {*}
   */
  getRandomInteger: (min, max) => {
    if (min >= max) {
      throw Error(`Invalid range: [${min}, $[${max}]`);
    }
    const range = max - min + 1;
    return Math.floor(Math.random() * (range)) + min;
  },

  /**
   * Prefix object field names with prefix, trim string values
   * @param {object} obj - Object
   * @param {string} prefix - Prefix string
   * @param {boolean} trimValues - trim string values
   * @returns {object} prefixedObject
   */
  prefixFields: (obj, prefix, trimValues = true) => {
    const prefixedObj = {};
    Object.keys(obj).forEach((key) => {
      prefixedObj[`${prefix}${key}`] = typeof obj[key] === 'string' && trimValues ? obj[key].trim() : obj[key];
    });

    return prefixedObj;
  },

  /**
   * Validate object fields with schema, throws error if invalid
   * @param {Joi schema} schema - Object schema
   * @param {object} obj - Object to validate
   */
  validateObject(schema, obj) {
    const { error: err } = schema.validate(obj);
    if (err != null) {
      throw Error(`${err.message}, got:\n ${JSON.stringify(obj, null, 2)}`);
    }
  },

  cloneObject(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  },
};
