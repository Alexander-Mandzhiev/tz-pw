const PASSWORD_RULE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const PASSWORD_RULE_MESSAGE =
    'Пароль должен состоять минимум из 8 символов, 1 прописной и строчной буквы, цифры и специального символа.';

const EMAIL_RULE_MESSAGE = `Электронная почта должна быть длиной не менее 5 символов.`
const EMAIL_RULE_MESSAGE_LENGTH = `5`

const MIN_RULE_MESSAGE = "Введите не менее 2 символов"
const MIN_RULE_LENGTH = "2"

export const REGEX = {
    PASSWORD_RULE,
};

export const MESSAGES = {
    PASSWORD_RULE_MESSAGE,
    EMAIL_RULE_MESSAGE,
    EMAIL_RULE_MESSAGE_LENGTH,
};

export const CREATING = {
    MIN_RULE_MESSAGE,
    MIN_RULE_LENGTH
}