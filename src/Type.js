
function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

function checkRequired(value) {
  // String trim
  if (typeof value === 'string') {
    value = value.replace(/(^\s*)|(\s*$)/g, '');
  }

  // String/Array length > 0
  if (value && value.length && value.length > 0) {
    return true;
  }

  return !isEmpty(value);
}


class Type {
  constructor(name) {
    this.name = name;
    this.required = false;
    this.requiredMessage = '';
    this.rules = [];
  }

  check(value) {

    if (this.required && !checkRequired(value)) {
      return { hasError: true, errorMessage: this.requiredMessage };
    }

    for (let i = 0; i < this.rules.length; i += 1) {
      let { onValid, errorMessage } = this.rules[i];

      if (!this.required && isEmpty(value)) {
        return { hasError: false };
      }

      let checkStatus = onValid(value);

      if (typeof checkStatus === 'boolean' && !checkStatus) {
        return { hasError: true, errorMessage };
      } else if (typeof checkStatus === 'object') {
        return checkStatus;
      }
    }

    return { hasError: false };
  }

  addRule(onValid, errorMessage) {
    errorMessage = errorMessage || this.rules[0].errorMessage;
    this.rules.push({
      onValid,
      errorMessage
    });
    return this;
  }
  isRequired(errorMessage) {
    this.required = true;
    this.requiredMessage = errorMessage;
    return this;
  }
}

export default Type;
