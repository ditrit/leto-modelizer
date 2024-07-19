#Code TF pour créer une instance avec nginx installé 
#et un hello world dessus et un enregistrement dns de www.toto.com 
#qui enverrait le traffic sur l'instance sur le port 80
#ainsi qu'un bucket S3 avec un utilisateur

provider "aws" {
    region = "us-east-1"
}

resource "aws_instance" "nginx_instance" {
    ami = "ami-0c55b159cbfafe1f0"
    instance_type = "t2.micro"
    user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install nginx1.12 -y
              systemctl start nginx
              systemctl enable nginx
              echo Hello, World! > /usr/share/nginx/html/index.html
              EOF
    tags = {
        Name = "nginx-server"
    }
}

resource "aws_eip" "nginx_eip" {
    instance = aws_instance.nginx_instance.id
}

resource "aws_route53_zone" "main" {
    name = "toto.com"
}

resource "aws_route53_record" "www" {
    zone_id = aws_route53_zone.main
    name    = "www.toto.com"
    type    = "A"
    ttl     = "300"
    records = [aws_eip.nginx_eip.public_ip]
}

resource "aws_security_group" "allow_http" {
    name_prefix = "allow_http"
    ingress {
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = [
            "0.0.0.0/0",
        ]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = [
            "0.0.0.0/0",
        ]
    }
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name"
  tags    = {
  Name           = "MyS3Bucket"
  Environment    = "Production"
  }
}

resource "aws_iam_user" "rw_user" {
  name = "rw-user"
}

resource "aws_iam_policy" "rw_policy" {
  name        = "rw_policy"
  description = "Read-Write access to S3 bucket"
  policy      = data.aws_iam_policy_document.rw_policy.json
}

resource "aws_iam_user_policy_attachment" "rw_user_policy_attachment" {
  user       = aws_iam_user.rw_user.name
  policy_arn = aws_iam_policy.rw_policy.arn
}

data "aws_iam_policy_document" "rw_policy" {
  statement {
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.my_bucket.arn, "${aws_s3_bucket.my_bucket.arn}/*"]
  }
}

output "bucket_name" {
  value = aws_s3_bucket.my_bucket.bucket
}

output "rw_user_access_key" {
  value = aws_iam_access_key.rw_user_access_key.id
}

output "rw_user_secret_key" {
  value = aws_iam_access_key.rw_user_access_key.secret
}