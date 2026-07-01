import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import css from "./NoteForm.module.css";
import type { CreateNoteRequest } from "../../types/note";

interface NoteFormProps {
  onSubmit: (values: CreateNoteRequest) => void;
  onClose: () => void;
  isPending: boolean;
}

const INITIAL_VALUES: CreateNoteRequest = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, "To short")
    .max(50, "To long")
    .required("Title is required"),
  content: Yup.string().max(500, "To long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({
  onSubmit,
  onClose,
  isPending,
}: NoteFormProps) {
  const fieldId = useId();

  const handleSubmit = (values: CreateNoteRequest) => {
    onSubmit(values);
  };
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={NoteSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component={"span"} className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            name="content"
            component={"span"}
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component={"span"} className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={css.submitButton}
          >
            {isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
