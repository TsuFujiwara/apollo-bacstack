export default (state, action) => {
  switch (action.type) {
    case "QUERY_PUSH":
      return { query: true };
    default:
      throw new Error();
  }
};
