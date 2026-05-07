const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 120,
  subjectMin: 3,
  subjectMax: 120,
  messageMin: 12,
  messageMax: 1000,
  companyMax: 120,
};

const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const companyPattern = /^[A-Za-z0-9][A-Za-z0-9 &'().,\-/]*$/;

const trimValue = (value = "") => value.trim();
const textTokenPattern = /[A-Za-z0-9]+/g;
const repeatedSingleCharacterPattern = /^([A-Za-z0-9])\1+$/;

const isRepeatedSingleCharacterText = (value = "") => {
  const condensed = value.replace(/[^A-Za-z0-9]/g, "").toLowerCase();

  return condensed.length >= 3 && repeatedSingleCharacterPattern.test(condensed);
};

const isRepeatedLetterToken = (token = "") =>
  token.length >= 3 && /^([A-Za-z])\1+$/i.test(token);

const hasMeaningfulText = (value = "", minimumWords = 1) => {
  const trimmed = trimValue(value);
  const tokens = trimmed.match(textTokenPattern) || [];
  const letterTokens = tokens.filter((token) => /[A-Za-z]/.test(token));
  const tokensWithVowels = letterTokens.filter((token) => /[aeiou]/i.test(token));
  const longLetterTokens = letterTokens.filter((token) => token.length >= 3);
  const obviousKeyboardMash = /^(qwerty|asdf|zxcv|poiuy|lkjh|mnbv|abc(?:def)?|test)+$/i;
  const allLetterTokensAreRepeated =
    letterTokens.length > 0 && letterTokens.every(isRepeatedLetterToken);

  if (
    !trimmed ||
    isRepeatedSingleCharacterText(trimmed) ||
    allLetterTokensAreRepeated ||
    obviousKeyboardMash.test(trimmed.replace(/\s+/g, ""))
  ) {
    return false;
  }

  if (tokens.length < minimumWords) {
    return false;
  }

  if (longLetterTokens.length === 0) {
    return false;
  }

  return tokensWithVowels.length > 0;
};

export const validateName = (value = "") => {
  const trimmed = trimValue(value);

  if (
    !trimmed ||
    trimmed.length < LIMITS.nameMin ||
    trimmed.length > LIMITS.nameMax ||
    isRepeatedSingleCharacterText(trimmed) ||
    !namePattern.test(trimmed)
  ) {
    return "Enter a valid name";
  }

  return "";
};

export const validateEmail = (value = "") => {
  const trimmed = trimValue(value);

  if (!trimmed || trimmed.length > LIMITS.emailMax || /\s/.test(trimmed)) {
    return "Enter a valid email";
  }

  const parts = trimmed.split("@");

  if (
    parts.length !== 2 ||
    !parts[0] ||
    !parts[1] ||
    parts[1].startsWith(".") ||
    parts[1].endsWith(".") ||
    !parts[1].includes(".")
  ) {
    return "Enter a valid email";
  }

  return "";
};

export const validateSubject = (value = "") => {
  const trimmed = trimValue(value);

  if (
    !trimmed ||
    trimmed.length < LIMITS.subjectMin ||
    trimmed.length > LIMITS.subjectMax ||
    !hasMeaningfulText(trimmed, 1)
  ) {
    return "Enter a valid subject";
  }

  return "";
};

export const validateMessage = (value = "") => {
  const trimmed = trimValue(value);

  if (
    !trimmed ||
    trimmed.length < LIMITS.messageMin ||
    trimmed.length > LIMITS.messageMax ||
    !hasMeaningfulText(trimmed, 3)
  ) {
    return "Enter a valid message";
  }

  return "";
};

export const validateCompany = (value = "") => {
  const trimmed = trimValue(value);

  if (!trimmed) {
    return "";
  }

  if (trimmed.length > LIMITS.companyMax || !companyPattern.test(trimmed)) {
    return "Enter a valid company name";
  }

  return "";
};

export const validateContactForm = (values) => {
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    subject: validateSubject(values.subject),
    message: validateMessage(values.message),
  };

  return errors;
};

export const validateDemoForm = (values) => {
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    company: validateCompany(values.company),
    message: validateMessage(values.message),
  };

  return errors;
};

export const hasErrors = (errors) =>
  Object.values(errors).some((value) => Boolean(value));

export const sanitizeFormPayload = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, trimValue(value)])
  );

export { LIMITS };
