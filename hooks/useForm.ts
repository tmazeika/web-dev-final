import type { SyntheticEvent } from 'react';
import { useCallback, useReducer, useState } from 'react';

/** Controls a single form value. */
export interface FormValueController<T> {
  /** The current value. */
  readonly value: Readonly<T>;

  /** Sets the value. */
  set(value: T): void;
}

/** A map of form keys to errors found during their validation. */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface Form<T> {
  /** All values of the form. */
  readonly values: Readonly<T>;
  /** Errors in the form. */
  readonly errors: Readonly<FormErrors<T>>;
  /** Whether the form is in the process of being submitted. */
  readonly isSubmitting: boolean;

  /** Sets a single value. */
  set<K extends keyof T>(this: void, key: K, value: T[K]): void;

  /**
   * Sets many values at once. Especially useful for prefilling data after a
   * `fetch()`, for example.
   */
  setMany(this: void, data: Partial<T>): void;

  /** Creates a controller for a value. */
  control<K extends keyof T>(this: void, key: K): FormValueController<T[K]>;

  /** Submits this form after validating input. */
  onSubmit(this: void, e?: SyntheticEvent): void;

  /** Resets all values. */
  reset(this: void): void;
}

/**
 * Controls an HTML form.
 *
 * @param initialValues The initial values of the form inputs.
 * @param onValidate    Called to validate each input.
 * @param onSubmit      Called to submit the form.
 */
export default function useForm<T>({
  initialValues,
  onValidate,
  onSubmit,
}: {
  initialValues: T;
  onValidate?: (values: Readonly<T>, errors: FormErrors<T>) => void;
  onSubmit?: (values: Readonly<T>) => Promise<void> | void;
}): Form<T> {
  const [values, dispatch] = useReducer(
    // This reducer turns actions into reducers. See why in the `set()` function
    // below.
    (state: T, action: (state: T) => T) => action(state),
    initialValues,
  );
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setSubmitting] = useState(false);

  const set = useCallback(<K extends keyof T>(k: K, v: T[K]) => {
    dispatch((state) =>
      // This action _is_ a reducer: only update the state when state[k] = v
      // would actually change anything. This is done to avoid an infinite
      // update loop if `set` is called synchronously in a component's render
      // function.
      Object.is(state[k], v) ? state : { ...state, [k]: v },
    );
    // Clear any errors for this key that may have been set due to a previously
    // failed submission. You might want to change this behavior depending on
    // your desired UX.
    setErrors((errors) => ({ ...errors, [k]: undefined }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    set,
    setMany: useCallback(
      (data: Partial<T>) =>
        // `setMany` just calls `set` for each entry in `data`.
        Object.entries(data).forEach(([k, v]) =>
          set(k as keyof T, v as T[keyof T]),
        ),
      [set],
    ),
    control: useCallback(
      <K extends keyof T>(k: K): FormValueController<T[K]> => ({
        value: values[k],
        // You can think of this as a curried `set()`.
        set: (v: T[K]) => set(k, v),
      }),
      [values, set],
    ),
    onSubmit: useCallback(
      (e?: SyntheticEvent) => {
        e?.preventDefault();
        const errors: FormErrors<T> = {};
        // Validation isn't required; we don't _have_ to pass in an `onValidate`
        // function.
        onValidate?.(values, errors);
        if (Object.values(errors).some((e) => e !== undefined)) {
          setErrors(errors);
          return;
        }
        // Handling submission also isn't required; while it doesn't make much
        // sense for a production application, it might be nice to not have to
        // implement it right away during development.
        const submit = onSubmit?.(values);
        // If `onSubmit` returns a Promise instead of void (or undefined if
        // there's no `onSubmit` function), then handle the `submitting` state
        // variable:
        if (submit) {
          setSubmitting(true);
          // Warning! This may throw a React warning if the component using this
          // hook unmounts (because the promise could resolve after unmount).
          // You may want to create another hook that can create promises that
          // don't resolve after a component unmounts.
          void submit.then(() => {
            setSubmitting(false);
          });
        }
      },
      [onValidate, onSubmit, values],
    ),
    reset: useCallback(() => {
      // Clear everything.
      dispatch(() => initialValues);
      setErrors({});
    }, [initialValues]),
  };
}
