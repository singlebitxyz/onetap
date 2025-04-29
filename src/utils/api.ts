const fetchApi = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });
};

export default fetchApi;
