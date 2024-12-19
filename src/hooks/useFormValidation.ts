import { useState, useCallback } from 'react';
import { z } from 'zod';

type ValidationErrors = Record<string, string>;

interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback(
    (data: unknown): ValidationResult => {
      try {
        schema.parse(data);
        setErrors({});
        return { isValid: true, errors: {} };
      } catch (err) {
        if (err instanceof z.ZodError) {
          const formattedErrors = err.errors.reduce((acc, curr) => {
            const path = curr.path.join('.');
            acc[path] = curr.message;
            return acc;
          }, {} as ValidationErrors);
          
          setErrors(formattedErrors);
          return { isValid: false, errors: formattedErrors };
        }
        
        // Handle unexpected errors
        const unexpectedError = { '': 'An unexpected error occurred' };
        setErrors(unexpectedError);
        return { isValid: false, errors: unexpectedError };
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors[field];
  }, [errors]);

  return {
    errors,
    validate,
    clearErrors,
    getFieldError,
  };
} 