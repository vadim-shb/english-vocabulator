package dao

import javax.inject.Singleton

import domain.User
import persistence.DbConnected
import scalikejdbc._

@Singleton
class UserDao extends DbConnected {

  def userMapper(rs: WrappedResultSet)(implicit session: DBSession) = {
    val userId = rs.long("id")
    User(
      id = userId,
      username = rs.string("username")
    )
  }

  def findUserByUsername(username: String): Option[User] = {
    insideReadOnly { implicit session =>
      sql"""SELECT * FROM t_user
            WHERE username = ${username}"""
        .map(userMapper).single.apply
    }
  }

}
