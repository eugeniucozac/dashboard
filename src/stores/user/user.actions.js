export const setTokenExpired = (data) => {
  return {
    type: 'USER_TOKEN_EXPIRED',
    payload: data || false,
  };
};
