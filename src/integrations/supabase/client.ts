// Lightweight placeholder client used when Supabase is not required.
// This prevents runtime crashes if no Supabase credentials are configured
// and allows the rest of the UI to render safely.

type QueryResult<T = any> = {
  data: T | null;
  error: null;
};

class DummyQueryBuilder<T = any> {
  private _data: T[] = [];

  from() {
    return this;
  }

  select() {
    return this;
  }

  order() {
    return this;
  }

  eq() {
    return this;
  }

  limit() {
    return this;
  }

  async then<TResult1 = QueryResult<T[]>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T[]>) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    const result: QueryResult<T[]> = { data: this._data, error: null };
    return Promise.resolve(result).then(onfulfilled, onrejected) as Promise<TResult1 | TResult2>;
  }
}

export const supabase = {
  from<T = any>(_table: string) {
    // Return a dummy query builder so existing calling code keeps working.
    return new DummyQueryBuilder<T>();
  },
};
