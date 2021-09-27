const allDataInDb = async (Model) => {
  const allUsers = await Model.find({});
  return allUsers;
};

const getUniqueID = async (Model) => {
  const allPostsInDb = await allDataInDb(Model);
  const { uniqueID } = allPostsInDb[0];
  return uniqueID;
};

module.exports = { allDataInDb, getUniqueID };
