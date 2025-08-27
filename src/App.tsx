import React, { useEffect, useMemo, useRef, useState } from 'react';
import { USER_ID, Todo, getTodos, createTodo, deleteTodo } from './api/todos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter, FilterBy } from './components/Filter/Filter';
import { UserWarning } from './components/UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const errorTimerRef = useRef<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMsg = (msg: string) => {
    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setError(msg);
    setShowError(true);

    errorTimerRef.current = window.setTimeout(() => {
      setShowError(false);
      errorTimerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setShowError(false);
      setError(null);

      try {
        await new Promise(r => setTimeout(r, 150));
        const data = await getTodos(USER_ID);

        if (!cancelled) {
          setTodos(data);
        }
      } catch {
        if (!cancelled) {
          showErrorMsg('Unable to load todos');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Active:
        return todos.filter(t => !t.completed);
      case FilterBy.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filterBy]);

  const activeCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );
  const hasCompleted = useMemo(() => todos.some(t => t.completed), [todos]);

  // handle create
  const handleCreate = async (raw: string) => {
    const title = raw.trim();

    if (!title) {
      showErrorMsg('Title should not be empty');
      setTimeout(() => inputRef.current?.focus(), 0);

      return;
    }

    const temp: Todo = { id: 0, userId: USER_ID, title, completed: false };

    setTempTodo(temp);
    setCreating(true);
    setShowError(false);

    try {
      await new Promise(r => setTimeout(r, 150));
      // use your api signature: (title: string, userId: number)
      const created = await createTodo(USER_ID, { title, completed: false });

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      showErrorMsg('Unable to add a todo');
    } finally {
      setCreating(false);
      setTempTodo(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleDelete = async (todo: Todo) => {
    setShowError(false);
    setDeletingIds(prev => new Set(prev).add(todo.id));
    try {
      await deleteTodo(todo.id);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch {
      showErrorMsg('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);

        next.delete(todo.id);

        return next;
      });

      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    setDeletingIds(prev => {
      const next = new Set(prev);

      completed.forEach(t => next.add(t.id));

      return next;
    });

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    const succeededIds = new Set<number>();
    let hadError = false;

    results.forEach((res, idx) => {
      const id = completed[idx].id;

      if (res.status === 'fulfilled') {
        succeededIds.add(id);
      } else {
        hadError = true;
      }
    });

    setTodos(prev => prev.filter(t => !succeededIds.has(t.id)));

    setDeletingIds(prev => {
      const next = new Set(prev);

      completed.forEach(t => next.delete(t.id));

      return next;
    });

    if (hadError) {
      showErrorMsg('Unable to delete a todo');
    }

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const hasTodos = todos.length > 0;

  return (
    <div className="todoapp" aria-busy={isLoading}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          value={newTitle}
          onChange={setNewTitle}
          disabled={creating}
          onCreate={handleCreate}
          inputRef={inputRef}
        />

        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            loadingIds={deletingIds}
            disableActions={creating}
            tempTodo={tempTodo}
            onDelete={handleDelete}
          />
        )}

        <Filter
          activeCount={activeCount}
          hasCompleted={hasCompleted}
          filterBy={filterBy}
          onChange={setFilterBy}
          onClearCompleted={handleClearCompleted}
          hasTodos={hasTodos || !!tempTodo}
        />
      </div>

      <UserWarning
        hidden={!showError}
        message={error ?? ''}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};
