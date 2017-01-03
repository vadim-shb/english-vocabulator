package throwables

class DuplicateInsertionException(message: String = null, cause: Throwable = null) extends RuntimeException(message, cause)

object DuplicateInsertionException {
  def apply() = new DuplicateInsertionException()
  def apply(message: String) = new DuplicateInsertionException(message)
  def apply(message: String, cause: Throwable) = new DuplicateInsertionException(message, cause)
  def apply(cause: Throwable) = new DuplicateInsertionException(cause = cause)
}