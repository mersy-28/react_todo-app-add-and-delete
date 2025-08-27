import React, { useEffect } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onCreate: (title: string) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
  onCreate,
  inputRef,
}) => {
  // keep the field focused by default
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (!disabled) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [disabled, inputRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(value);
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          type="text"
          placeholder="What needs to be done?"
          disabled={disabled}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <button type="submit" hidden aria-hidden="true" />
      </form>
    </header>
  );
};
