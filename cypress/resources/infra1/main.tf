resource "aws_instance" "tomcat" {
}

resource "aws_db_instance" "postgres" {
  instance_class = "postgres"
  vpc_security_group_ids = [aws_security_group.securityGroup.id]
}

resource "aws_security_group" "securityGroup" {
}
