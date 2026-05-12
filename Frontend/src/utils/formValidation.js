const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 50,
  subjectMin: 3,
  subjectMax: 120,
  messageMin: 12,
  messageMax: 1000,
  messageWordMax: 120,
  companyMax: 120,
};

const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const companyPattern = /^[A-Za-z0-9][A-Za-z0-9 &'().,\-/]*$/;
const emailPattern = /^[a-zA-Z0-9._%+-]{1,40}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const typoEmailDomains = new Set([
  "imal.com",
  "imail.com",
  "gmail.co",
  "gmail.c",
  "gmail.con",
  "gmail.cm",
  "gmail.om",
  "gmai.co",
  "gmai.com",
  "gmaill.com",
  "gail.com",
  "gmil.com",
  "gmial.com",
  "gamil.com",
  "gmali.com",
  "gmal.com",
  "yaho.com",
  "yahho.com",
  "hotmial.com",
  "outlok.com",
  "redifmail.com",
]);
const unsupportedEmailDomains = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mail.com",
  "mailinator.com",
  "tempmail.com",
  "throwawaymail.com",
  "yopmail.com",
]);

const trimValue = (value = "") => value.trim();
export const normalizeEmailInput = (value = "") => trimValue(value).toLowerCase();
export const getWordCount = (value = "") => {
  const words = trimValue(value).match(/\S+/g);
  return words ? words.length : 0;
};
const textTokenPattern = /[A-Za-z0-9]+/g;
const repeatedSingleCharacterPattern = /^([A-Za-z0-9])\1+$/;

const getEditDistance = (first = "", second = "") => {
  const rows = first.length + 1;
  const columns = second.length + 1;
  const distances = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let row = 0; row < rows; row += 1) {
    distances[row][0] = row;
  }

  for (let column = 0; column < columns; column += 1) {
    distances[0][column] = column;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = first[row - 1] === second[column - 1] ? 0 : 1;
      distances[row][column] = Math.min(
        distances[row - 1][column] + 1,
        distances[row][column - 1] + 1,
        distances[row - 1][column - 1] + cost
      );
    }
  }

  return distances[first.length][second.length];
};

const isGmailTypoDomain = (domain = "") => {
  const labels = domain.split(".");
  const provider = labels[0] || "";
  const extension = labels.slice(1).join(".");

  if (domain === "gmail.com") {
    return false;
  }

  if (provider === "gmail") {
    return true;
  }

  return extension === "com" && provider.length >= 4 && provider.length <= 6
    ? getEditDistance(provider, "gmail") <= 2
    : false;
};

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
  const normalized = normalizeEmailInput(value);
  const parts = normalized.split("@");
  const localPart = parts[0] || "";
  const domain = parts[1] || "";
  const domainLabels = domain.split(".");

  if (!normalized) {
    return "Enter a valid email address";
  }

  if (normalized.length > LIMITS.emailMax) {
    return `Email must be ${LIMITS.emailMax} characters or less`;
  }

  if (/\s/.test(normalized)) {
    return "Enter a valid email address";
  }

  if (
    parts.length !== 2 ||
    !localPart ||
    !domain ||
    /^\d+$/.test(localPart) ||
    normalized.includes("..") ||
    normalized.startsWith(".") ||
    normalized.endsWith(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    !domain.includes(".") ||
    domainLabels.some((label) => !label || label.startsWith("-") || label.endsWith("-")) ||
    !emailPattern.test(normalized)
  ) {
    return "Enter a valid email address";
  }

  if (typoEmailDomains.has(domain)) {
    return "Please enter a valid email domain";
  }

  if (isGmailTypoDomain(domain)) {
    return "Please enter a valid email domain";
  }

  if (unsupportedEmailDomains.has(domain)) {
    return "This email domain is not supported";
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

  if (getWordCount(trimmed) > LIMITS.messageWordMax) {
    return `Message must be ${LIMITS.messageWordMax} words or less`;
  }

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
    Object.entries(values).map(([key, value]) => [
      key,
      key.toLowerCase().includes("email") ? normalizeEmailInput(value) : trimValue(value),
    ])
  );

export { LIMITS };
