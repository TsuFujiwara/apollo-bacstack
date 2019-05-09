export default function reducer(state, { type, payload }) {
  switch (type) {
    case "QUERY_PUSH":
      return { query: true };
    default:
      throw new Error();
  }
}
