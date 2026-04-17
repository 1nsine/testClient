import { FiEdit3, FiHelpCircle, FiPlusCircle, FiSearch } from "react-icons/fi";
import { Button } from "../../../../UI/Button/Button";
import type { ApiQuestion } from "../../../../types/api";
import { getQuestionPreview, type QuestionFormState } from "../models";
import styles from "../DashBoard.module.css";

type QuestionsSectionProps = {
  questionsCount: number;
  questionSearch: string;
  filteredQuestions: ApiQuestion[];
  questionForm: QuestionFormState;
  questionSaving: boolean;
  onSearchChange: (value: string) => void;
  onResetForm: () => void;
  onQuestionFormChange: (
    updater: (prev: QuestionFormState) => QuestionFormState,
  ) => void;
  onAnswerChange: (
    index: number,
    field: "text" | "is_correct",
    value: string | boolean,
  ) => void;
  onSubmit: () => void;
  onStartEditing: (question: ApiQuestion) => void;
};

export function QuestionsSection({
  questionsCount,
  questionSearch,
  filteredQuestions,
  questionForm,
  questionSaving,
  onSearchChange,
  onResetForm,
  onQuestionFormChange,
  onAnswerChange,
  onSubmit,
  onStartEditing,
}: QuestionsSectionProps) {
  const hasSearch = questionSearch.trim().length > 0;

  return (
    <section
      id="questions"
      className={`${styles.section} ${styles.viewportSection}`}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionLabel}>Вопросы</p>
          <h3>Добавление и поиск вопросов</h3>
        </div>
        <div className={styles.pill}>
          <FiHelpCircle size={16} />
          <span>{questionsCount} вопросов в банке</span>
        </div>
      </div>

      <div className={styles.questionsLayoutCompact}>
        <div className={styles.questionEditor}>
          <div className={styles.formHeader}>
            <div>
              <p className={styles.sectionLabel}>
                {questionForm.id ? "Редактирование" : "Новый вопрос"}
              </p>
              <h4>
                {questionForm.id
                  ? `Вопрос №${questionForm.question_number || questionForm.id}`
                  : "Добавить вопрос"}
              </h4>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onResetForm}
              style={{ alignContent: "center" }}
            >
              <FiPlusCircle size={16} />
              Новый
            </Button>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Номер вопроса</span>
              <input
                type="number"
                min={1}
                value={questionForm.question_number}
                onChange={(event) =>
                  onQuestionFormChange((prev) => ({
                    ...prev,
                    question_number: event.target.value,
                  }))
                }
              />
            </label>

            <label className={styles.field}>
              <span>Ссылка на изображение</span>
              <input
                type="text"
                value={questionForm.image_url}
                onChange={(event) =>
                  onQuestionFormChange((prev) => ({
                    ...prev,
                    image_url: event.target.value,
                  }))
                }
                placeholder="https://..."
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Текст вопроса</span>
            <textarea
              rows={4}
              value={questionForm.question}
              onChange={(event) =>
                onQuestionFormChange((prev) => ({
                  ...prev,
                  question: event.target.value,
                }))
              }
              placeholder="Введите формулировку вопроса"
            />
          </label>

          <div className={styles.answersBlock}>
            <div className={styles.formHeader}>
              <div>
                <p className={styles.sectionLabel}>Ответы</p>
                <h4>Выберите один правильный вариант</h4>
              </div>
            </div>

            <div className={styles.answerList}>
              {questionForm.answers.map((answer, index) => (
                <div
                  key={`${questionForm.id ?? "new"}-${answer.number}`}
                  className={styles.answerRow}
                >
                  <label className={styles.answerToggle}>
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={answer.is_correct}
                      onChange={() => onAnswerChange(index, "is_correct", true)}
                    />
                    <span>Верный</span>
                  </label>
                  <label className={styles.field}>
                    <span>Вариант {index + 1}</span>
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(event) =>
                        onAnswerChange(index, "text", event.target.value)
                      }
                      placeholder={`Ответ ${index + 1}`}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.questionActions}>
            <Button
              type="button"
              variant="filled"
              onClick={onSubmit}
              disabled={questionSaving}
            >
              {questionSaving
                ? "Сохранение..."
                : questionForm.id
                  ? "Сохранить изменения"
                  : "Добавить вопрос"}
            </Button>
            {questionForm.id && (
              <Button type="button" variant="outline" onClick={onResetForm}>
                Отменить редактирование
              </Button>
            )}
          </div>
        </div>

        <div className={styles.questionFinder}>
          <div className={styles.formHeader}>
            <div>
              <p className={styles.sectionLabel}>Поиск</p>
              <h4>Найти вопрос для редактирования</h4>
            </div>
          </div>

          <div className={styles.userToolbar}>
            <label className={styles.userSearchWrap}>
              <FiSearch size={18} />
              <input
                type="search"
                value={questionSearch}
                onChange={(event) => onSearchChange(event.target.value)}
                className={styles.userSearch}
                placeholder="Поиск по номеру или тексту вопроса"
              />
            </label>
            <span className={styles.userCount}>
              {hasSearch
                ? `${filteredQuestions.length} найдено`
                : "Введите запрос"}
            </span>
          </div>

          {!hasSearch ? (
            <div className={styles.emptyUsers}>
              <FiHelpCircle size={26} />
              <div>
                <strong>Список вопросов скрыт</strong>
                <p>
                  Введите номер или часть текста вопроса, чтобы найти его и
                  открыть на редактирование.
                </p>
              </div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className={styles.emptyUsers}>
              <FiHelpCircle size={26} />
              <div>
                <strong>Вопросы не найдены</strong>
                <p>Измените запрос и попробуйте снова.</p>
              </div>
            </div>
          ) : (
            <div className={styles.questionSearchResults}>
              {filteredQuestions.slice(0, 8).map((question) => (
                <article
                  key={question.id}
                  className={styles.questionResultCard}
                >
                  <div>
                    <p className={styles.sectionLabel}>
                      Вопрос №{question.question_number}
                    </p>
                    <h4>{getQuestionPreview(question.question, 180)}</h4>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onStartEditing(question)}
                  >
                    <FiEdit3 size={16} />
                    Редактировать
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
