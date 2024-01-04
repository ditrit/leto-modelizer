resource "aws_subnet" "id_1" {
    gateway_id = [
        aws_internet_gateway.id_2.id,
    ]
}

resource "aws_internet_gateway" "id_2" {
}
