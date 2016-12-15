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
      email = rs.string("email")
    )
  }

  def findUserByUsername(email: String): Option[User] = {
    insideReadOnly { implicit session =>
      sql"""SELECT * FROM t_user
            WHERE email = ${email}"""
        .map(userMapper).single.apply
    }
  }

}
