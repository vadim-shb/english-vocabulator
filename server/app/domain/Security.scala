package domain

import java.time.LocalDateTime


case class SecurityUser(
                         id: Option[Long] = None,
                         email: String,
                         salt: String,
                         passwordHash:String
                       )

case class SecurityUserSessionTokens(
                         userId: Long,
                         accessToken: String,
                         refreshToken: String,
                         accessTokenExpirationTime: LocalDateTime,
                         refreshTokenExpirationTime: LocalDateTime
                       )