const getUsers = `SELECT * FROM dbTest.dbo.tblUser`;
const getUser = `SELECT * FROM dbTest.dbo.tblUser u WHERE u.Username = @Username`;

module.exports = {
    getUsers,
    getUser
}