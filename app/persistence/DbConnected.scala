package persistence

import java.sql.Connection

import scalikejdbc.{ConnectionPool, DB, DBSession}
import scalikejdbc._

trait DbConnected {
  private def connectionFromPool : Connection = ConnectionPool.borrow('vocabulator_db)
  protected def dbFromPool : DB = DB(connectionFromPool)

  def insideLocalTx[A](sqlRequest: DBSession => A): A = {
    using(dbFromPool) { db =>
      db localTx { session =>
        sqlRequest(session)
      }
    }
  }

  def insideReadOnly[A](sqlRequest: DBSession => A): A = {
    using(dbFromPool) { db =>
      db readOnly { session =>
        sqlRequest(session)
      }
    }
  }
}
