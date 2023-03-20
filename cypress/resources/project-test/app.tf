provider "aws" {
    access_key = "ABCD1234J54PXLDF4IC4WMVA"
    secret_key = "28prpojfngldfgPcgiv79Q/J+8o7ksdfsTjmmE2QQBRa"
    region = "eu-west-3"
}

module "server" {
    source = "../modules/server"
}

data "aws_ami" "web" {
    filter {
        name = "state"
        values = ["available"]
    }
    most_recent = true
}

resource "aws_route53_zone" "publicdns" {
    name = "aws.domaine.fr"
    image_id = null
    position = 1
}

variable "image_id" {
    type = "string"
}
