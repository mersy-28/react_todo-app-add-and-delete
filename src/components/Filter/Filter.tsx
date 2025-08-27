import React from 'react';
import cn from 'classnames';

export enum FilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  activeCount: number;
  hasCompleted: boolean;
  filterBy: FilterBy;
  onChange: (f: FilterBy) => void;
  onClearCompleted: () => void;
  hasTodos: boolean;
};

export const Filter: React.FC<Props> = ({
  activeCount,
  hasCompleted,
  filterBy,
  onChange,
  onClearCompleted,
  hasTodos,
}) => {
  if (!hasTodos) {
    return null;
  }

  return (
    <footer className="footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <ul className="filters" data-cy="Filter">
        <li>
          <a
            href="#/"
            data-cy="FilterLinkAll"
            className={cn({ selected: filterBy === FilterBy.All })}
            onClick={e => {
              e.preventDefault();
              onChange(FilterBy.All);
            }}
          >
            All
          </a>
        </li>

        <li>
          <a
            href="#/active"
            data-cy="FilterLinkActive"
            className={cn({ selected: filterBy === FilterBy.Active })}
            onClick={e => {
              e.preventDefault();
              onChange(FilterBy.Active);
            }}
          >
            Active
          </a>
        </li>

        <li>
          <a
            href="#/completed"
            data-cy="FilterLinkCompleted"
            className={cn({ selected: filterBy === FilterBy.Completed })}
            onClick={e => {
              e.preventDefault();
              onChange(FilterBy.Completed);
            }}
          >
            Completed
          </a>
        </li>
      </ul>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="clear-completed"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
