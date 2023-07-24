resource "aws_subnet" "aws_subnet_1" {
    gateway_id = [
        aws_internet_gateway_1,
    ]
}

resource "aws_internet_gateway" "aws_internet_gateway_1" {
}
