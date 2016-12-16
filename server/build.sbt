name := "vocabulator"

version := "1.0"

lazy val `vocabulator` = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq( jdbc , cache , ws , specs2 % Test )

unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"

val scalikejdbcV = "2.3.5"

libraryDependencies ++= Seq(
  "org.postgresql"          %  "postgresql"                     % "9.4-1201-jdbc41",
  "org.scalikejdbc"         %% "scalikejdbc"                    % scalikejdbcV,
  "org.scalikejdbc"         %% "scalikejdbc-config"             % scalikejdbcV,
  "org.scalikejdbc"         %% "scalikejdbc-play-dbapi-adapter" % "2.5.0",
  "org.apache.commons"      %  "commons-lang3"                  % "3.4",
  "com.ticketfly"           %% "play-liquibase"                 % "1.0",
  "org.lazyluke"            %  "log4jdbc-remix"                 % "0.2.7"
)