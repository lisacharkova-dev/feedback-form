import { useState } from "react";
import "./FeedbackForm.css";

const MAX_MESSAGE_LENGTH = 500;

function FeedbackForm() {
  // --- Состояния значений полей ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [wantReply, setWantReply] = useState(false); // Задание 3

  // --- Состояние процесса отправки ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Состояние ошибок ---
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  // --- Состояние "тронутых" полей ---
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // --- Состояние успешной отправки ---
  const [submitted, setSubmitted] = useState(false);

  // ============================================
  // ЗАДАНИЕ 2: ФОРМАТИРОВАНИЕ ТЕЛЕФОНА (маска)
  // ============================================
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length === 0) return "";
    if (digits.length === 1) return "+7";
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7)
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9)
      return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
      7,
      9
    )}-${digits.slice(9, 11)}`;
  };

  // --- Функции валидации ---
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim()))
      return "Только буквы, пробелы и дефис";
    return null;
  };

  // ============================================
  // ЗАДАНИЕ 3: Зависимая валидация Email
  // ============================================
  const validateEmail = (value) => {
    // Если чекбокс не включён и поле пустое — ошибки нет
    if (!wantReply && !value.trim()) return null;

    if (!value.trim()) return "Email обязателен для заполнения";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Некорректный формат email";
    return null;
  };

  // ============================================
  // ЗАДАНИЕ 2: Валидация телефона
  // ============================================
  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11) return "Введите 11 цифр";
    return null;
  };

  // ============================================
  // ЗАДАНИЕ 1: Валидация с верхним лимитом
  // ============================================
  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > MAX_MESSAGE_LENGTH)
      return `Максимум ${MAX_MESSAGE_LENGTH} символов`;
    return null;
  };

  const validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
  };

  // --- Обработчик изменения поля ---
  const handleChange = (field, value) => {
    let formattedValue = value;

    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        // Задание 2: применяем маску
        formattedValue = formatPhone(value);
        setPhone(formattedValue);
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](formattedValue),
      }));
    }
  };

  // --- Обработчик потери фокуса ---
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const currentValue =
      field === "name"
        ? name
        : field === "email"
        ? email
        : field === "phone"
        ? phone
        : message;

    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue),
    }));
  };

  // ============================================
  // ЗАДАНИЕ 3: Обработчик чекбокса
  // ============================================
  const handleWantReplyChange = (checked) => {
    setWantReply(checked);
    // Если поле email уже "тронуто" — пересчитываем его ошибку
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email),
      }));
    }
  };

  // --- Обработчик отправки формы ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // --- Динамические классы ---
  const getInputClass = (field) => {
    const classes = ["field__input"];

    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field]) {
      classes.push("field__input--valid");
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  // --- Экран успеха ---
  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setWantReply(false);
            setErrors({ name: null, email: null, phone: null, message: null });
            setTouched({
              name: false,
              email: false,
              phone: false,
              message: false,
            });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {/* Поле «Имя» */}
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      {/* Поле «Email» */}
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email {wantReply && <span className="field__required">*</span>}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      {/* ЗАДАНИЕ 2: Поле «Телефон» */}
      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон
        </label>
        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          placeholder="+7 (___) ___-__-__"
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      {/* Поле «Сообщение» + ЗАДАНИЕ 1: счётчик */}
      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <div className="field__counter">
          {message.length} / {MAX_MESSAGE_LENGTH}
        </div>
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      {/* ЗАДАНИЕ 3: Чекбокс «Хочу получить ответ» */}
      <div className="field field--checkbox">
        <label className="field__checkbox-label">
          <input
            type="checkbox"
            checked={wantReply}
            onChange={(e) => handleWantReplyChange(e.target.checked)}
          />
          Хочу получить ответ
        </label>
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;