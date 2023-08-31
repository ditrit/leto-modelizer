resource "aws_security_group" "aws_security_group_1" {
}

resource "aws_instance" "aws_instance_1" {
    security_groups = [aws_security_group.aws_security_group_1.name]
}

resource "aws_ebs_volume" "aws_ebs_volume_1" {
}
