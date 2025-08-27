import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  disableActions?: boolean;
  loading?: boolean;
  onToggle?: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  disableActions = false,
  loading = false,
  onToggle,
  onDelete,
}) => {
  const statusId = `todo-status-${todo.id}`;

  return (
    <li className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      {/* keep your label/input structure */}
      <label
        className="todo__status-label"
        htmlFor={statusId}
        aria-checked={todo.completed}
      >
        <input
          id={statusId}
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          readOnly
          disabled={disableActions || loading}
          onChange={() => onToggle?.(todo)}
        />
        <span className="visually-hidden">
          Mark todo as {todo.completed ? 'active' : 'completed'}
        </span>
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        aria-label="Delete todo"
        disabled={disableActions || loading}
        onClick={() => onDelete(todo)}
      >
        ×
      </button>

      {/* Loader overlay — always present; active only while loading */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
