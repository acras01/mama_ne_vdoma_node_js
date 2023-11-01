export const checkResponseForIds = (response, requiredIds) => {
  const responseIds = response.map((item) => item._id.toString());

  for (const id of requiredIds) {
    if (!responseIds.includes(id)) {
      throw new Error(`ID ${id} not found`);
    }
  }
};
